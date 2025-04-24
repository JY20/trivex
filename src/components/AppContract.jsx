import { Contract, Provider, cairo, CallData, shortString } from 'starknet';

const hash_provider = new Provider({ network: 'sepolia' });

const classHash = '0x029a498e0208b0b5a32141a1cd5a59552a699f7157fcda61ae016d81d0b8973f';
const contractAddress = '0x047e26510d78ba9d345dca4aa9e0e222e690a030bb9095b5e680faac5bf54da6';
const usdcTokenAddress = '0x53b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080';
const strkTokenAddress = '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

export class AppContract {
    /* global BigInt */

    constructor() {
    }

    async getABI() {
        const contractClass = await hash_provider.getClassByHash(classHash);
        return contractClass.abi;
    }

    async getWalletBalance(walletAddress) {
        const abi = await this.getABI();
        const contract = new Contract(abi, contractAddress, hash_provider);
        const balance = await contract.call('get_balance', [usdcTokenAddress, walletAddress]);
        const convertedBalance = (Number(balance) / 1000000).toFixed(2);
        return convertedBalance;
    }

    async getStakedBalance(walletAddress) {
        const abi = await this.getABI(classHash);
        const contract = new Contract(abi, contractAddress, hash_provider);
        const amount = await contract.call('get_staked', [usdcTokenAddress, walletAddress]);
        const convertedAmount = (Number(amount) / 1000000).toFixed(2);
        return convertedAmount;
    }

    async stake(account, amount) {
        const provider = account;
        const abi = await this.getABI(classHash);
        const contract = new Contract(abi, contractAddress, provider);
        const weiAmount = amount * 1000000; 

        const stake = contract.populate("stake", [BigInt(weiAmount), usdcTokenAddress]);

        const result = await provider.execute([
        {
            contractAddress: usdcTokenAddress,
            entrypoint: "approve",
            calldata: CallData.compile({
            spender: contractAddress,
            amount: cairo.uint256(weiAmount),
            }),
        },
        {
            contractAddress: contractAddress,
            entrypoint: "stake",
            calldata: stake.calldata,
        },
        ]);
        
        return result;
    }

    async unstake(account, amount) {
        const provider = account;
        const abi = await this.getABI(classHash);
        const contract = new Contract(abi, contractAddress, provider);
        const wei = BigInt(amount * 1e6);
        const unstakeCall = contract.populate('unstake', [wei, usdcTokenAddress]);

        const result = await provider.execute([
            {
                contractAddress,
                entrypoint: 'unstake',
                calldata: unstakeCall.calldata,
            },
        ]);

        return result;
    }

    async open_order(account, symbol, quantity, averagePrice, leverage, totalValue, action) {
        const provider = account;
        const contractClass = await hash_provider.getClassByHash(classHash);
        const abi = contractClass.abi;
        const contract = new Contract(abi, contractAddress, provider);

        const weiTotalValue = BigInt((totalValue * 1000000).toFixed(0));
        const weiAveragePrice = BigInt((averagePrice * 1000000).toFixed(0));
        const weiQuantity= BigInt((quantity*1000000).toFixed(0));
        const uint256Quantity = cairo.uint256(weiQuantity);
        const uint256AveragePrice = cairo.uint256(weiAveragePrice);
        const uint256TotalValue = cairo.uint256(weiTotalValue);
        const bigIntLeverage = BigInt(leverage);

        const openOrderCall = contract.populate("open_order", [
            symbol,
            uint256Quantity,
            uint256AveragePrice,
            bigIntLeverage,
            uint256TotalValue,
            action,
            usdcTokenAddress
        ]);

        const approvalCall = {
            contractAddress: usdcTokenAddress,
            entrypoint: "approve",
            calldata: CallData.compile({
                spender: contractAddress,
                amount: uint256TotalValue
            }),
        };
        const openOrderTransaction = {
            contractAddress: contractAddress,
            entrypoint: "open_order",
            calldata: openOrderCall.calldata
        };
        const result = await provider.execute([approvalCall, openOrderTransaction]);
        return result;
    }

    async close_order(account, id, amount, action) {
        const provider = account;
              
        const contractClass = await hash_provider.getClassByHash(classHash);
        const abi = contractClass.abi;
        const contract = new Contract(abi, contractAddress, provider);
    
        const positionId = BigInt(id);
        const amountWei = BigInt((amount*1000000).toFixed(0));

        const { calldata } = await contract.populate('close_order', [
            positionId,
            amountWei,
            action,
            usdcTokenAddress,
        ]);

        const result = await provider.execute([
        {
            contractAddress,
            entrypoint: 'close_order',
            calldata,
        }]);
        return result;
    }

    async getPositions(walletAddress) {
        const abi = await this.getABI(classHash);
        const contract = new Contract(abi, contractAddress, hash_provider);
        const positionsRaw = await contract.call('get_positions', [walletAddress]);
        
        const positions = positionsRaw.map(item => ({
            id: Number(item.id),
            symbol: shortString.decodeShortString(item.symbol),
            quantity: Number(item.quantity)/1000000,
            average_price: Number(item.average_price)/1000000, 
            leverage: Number(item.leverage),      
            total_value: Number(item.total_value)/1000000, 
            action: shortString.decodeShortString(item.action),
            datetime: new Date(Number(item.datetime) * 1000)
        }));
        
        return positions;
    }

    async getTransactions(walletAddress) {
        const abi = await this.getABI(classHash);
        const contract = new Contract(abi, contractAddress, hash_provider);
        const transactionsRaw = await contract.call('get_transactions', [walletAddress]);
        
        const transactions = transactionsRaw.map(item => ({
            symbol: shortString.decodeShortString(item.symbol),
            quantity: Number(item.quantity)/1000000,
            average_price: Number(item.average_price)/1000000, 
            leverage: Number(item.leverage),      
            total_value: Number(item.total_value)/1000000, 
            action: shortString.decodeShortString(item.action),
            datetime: new Date(Number(item.datetime) * 1000)
        }));
        
        return transactions;
    }

    async run_strategy(account, amount) {
        const provider = account;
        const contractClass = await hash_provider.getClassByHash(classHash);
        const abi = contractClass.abi;
        const contract = new Contract(abi, contractAddress, provider);

        const weiAmount = amount * 1e18;
    
        const run_strategy = contract.populate("run_strategy", [BigInt(weiAmount), strkTokenAddress]);

        const result = await provider.execute([
        {
            contractAddress: strkTokenAddress,
            entrypoint: "approve",
            calldata: CallData.compile({
            spender: contractAddress,
            amount: cairo.uint256(weiAmount),
            }),
        },
        {
            contractAddress: contractAddress,
            entrypoint: "run_strategy",
            calldata: run_strategy.calldata,
        }
        ]);

        return result;
    }
}
