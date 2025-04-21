import { Contract, Provider, cairo, CallData } from 'starknet';

const hash_provider = new Provider({ network: 'sepolia' });

const classHash = '0x07fe433a5d1200e98f5064b724a9585e420c044de4ac919c635a7ffeade2446d';
const contractAddress = '0x07c24158746afc38cc001da37cab6e301a951ce93fce6b68c77ce5947cf86531';
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

    async open_order(account, amount) {
        const provider = account;
        const contractClass = await hash_provider.getClassByHash(classHash);
        const abi = contractClass.abi;
        const contract = new Contract(abi, contractAddress, provider);
        const weiAmount = amount * 1000000;
    
        const deposit = contract.populate("deposit", [BigInt(weiAmount), usdcTokenAddress]);
    
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
            entrypoint: "deposit",
            calldata: deposit.calldata,
        },
        ]);

        return result;
    }

    async close_order(account, amount) {
        const provider = account;
              
        const contractClass = await hash_provider.getClassByHash(classHash);
        const abi = contractClass.abi;
        const contract = new Contract(abi, contractAddress, provider);
    
        const weiAmount = amount * 1000000;
    
        const withdrawal = contract.populate("withdraw", [BigInt(weiAmount), usdcTokenAddress]);
    
        const result = await provider.execute([{
            contractAddress: contractAddress,
            entrypoint: "withdraw",
            calldata: withdrawal.calldata,
        }]);

        return result;
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
