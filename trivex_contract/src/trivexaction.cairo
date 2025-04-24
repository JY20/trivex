use trivex_contract::interfaces::ITrivexAction;

#[starknet::contract]
mod TrivexAction {
    use trivex_contract::erc20::IERC20DispatcherTrait;
    use core::clone::Clone;
    use trivex_contract::interfaces::ITrivexAction;
    use starknet::{get_caller_address, ContractAddress, get_contract_address, get_block_timestamp};
    use trivex_contract::starkstructs::{Position};
    use trivex_contract::utils::{UserAddress, TokenAddress, Amount};
    use trivex_contract::erc20::{IERC20Dispatcher};
    
    #[storage]
    struct Storage {
        positions: LegacyMap<(UserAddress, u128), Position>,
        user_position_counts: LegacyMap<UserAddress, u128>,
        transactions: LegacyMap<(UserAddress, u128), Position>,
        user_transaction_counts: LegacyMap<UserAddress, u128>,
        staked: LegacyMap<(TokenAddress, UserAddress), Amount>
    }

    #[abi(embed_v0)]
    impl TrivexActionImpl of super::ITrivexAction<ContractState> {
        fn get_balance(self: @ContractState, token_address: TokenAddress, agent_address: UserAddress) -> Amount {
            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            token.balanceOf(agent_address)
        }

        fn open_order(ref self: ContractState, symbol: felt252, quantity: u256, average_price: u256, leverage: u128, total_value: u256, action: felt252, token_address: TokenAddress) {
            let caller = get_caller_address();

            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let transfer_success = token.transferFrom(
                caller,
                get_contract_address(),
                total_value,
            );

            assert(transfer_success, 'Token transfer failed.');
            
            if transfer_success {
                let count = self.user_position_counts.read(caller);
                let position = Position {
                    id: count,
                    symbol: symbol,
                    quantity: quantity,
                    average_price: average_price,
                    leverage: leverage,
                    total_value: total_value,
                    action: action,
                    datetime: get_block_timestamp()
                };
                self.positions.write((caller, count), position);
                self.user_position_counts.write(caller, count + 1);

                let count_transactions = self.user_transaction_counts.read(caller);
                let transaction = Position {
                    id: count_transactions,
                    symbol: symbol,
                    quantity: quantity,
                    average_price: average_price,
                    leverage: leverage,
                    total_value: total_value,
                    action: action,
                    datetime: get_block_timestamp()
                };
                self.transactions.write((caller, count_transactions), transaction);
                self.user_transaction_counts.write(caller, count_transactions + 1);
            }
        }

        fn close_order(ref self: ContractState, id: u128, amount: Amount, action: felt252, token_address: TokenAddress) {
            let caller = get_caller_address();

            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let position = self.positions.read((caller, id));
            // let amount = position.total_value;;

            let transfer_success = token.transfer(caller, amount);
            assert(transfer_success, 'Token transfer failed.');

            if transfer_success {
                let count = self.user_position_counts.read(caller);
                let mut i = id;
                while i + 1 <= count {
                    let next_pos = self.positions.read((caller, i + 1));
                    self.positions.write((caller, i), next_pos);
                    i = i + 1;
                };

                self.user_position_counts.write(caller, count - 1);

                let count_transactions = self.user_transaction_counts.read(caller);
                let transaction = Position {
                    id: position.id,
                    symbol: position.symbol,
                    quantity: position.quantity,
                    average_price: position.average_price,
                    leverage: position.leverage,
                    total_value: position.total_value,
                    action: action,
                    datetime: get_block_timestamp()
                };
                self.transactions.write((caller, count_transactions), transaction);
                self.user_transaction_counts.write(caller, count_transactions + 1);
            }
        }

        fn get_positions(self: @ContractState, user: UserAddress) -> Array<Position> {
            let count = self.user_position_counts.read(user);
            let mut positions = ArrayTrait::new();
            let mut i = 0;

            while i < count {
                let position = self.positions.read((user, i));
                positions.append(position);
                i = i + 1;
            };

            return positions;
        }

        fn get_transactions(self: @ContractState, user: UserAddress) -> Array<Position> {
            let count = self.user_transaction_counts.read(user);
            let mut transactions = ArrayTrait::new();
            let mut i = 0;

            while i < count {
                let transaction = self.transactions.read((user, i));
                transactions.append(transaction);
                i = i + 1;
            };

            return transactions;
        }

        fn run_strategy(ref self: ContractState, amount: Amount, token_address: TokenAddress) {
            let caller = get_caller_address();

            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let transfer_success = token.transferFrom(
                caller,
                get_contract_address(),
                amount,
            );

            assert(transfer_success, 'Token transfer failed.');
        }

        fn stake(ref self: ContractState, amount: Amount, token_address: TokenAddress) {
            let caller = get_caller_address();
            let token = IERC20Dispatcher { contract_address: token_address };

            // Transfer tokens from user to contract
            let success = token.transferFrom(caller, get_contract_address(), amount);
            assert(success, 'Stake transfer failed');

            if success {
                let current_staked = self.staked.read((token_address, caller));
                self.staked.write((token_address, caller), current_staked + amount);
            }
        }

        fn unstake(ref self: ContractState, amount: Amount, token_address: TokenAddress) {
            let caller = get_caller_address();
            let token = IERC20Dispatcher { contract_address: token_address };

            let current_staked = self.staked.read((token_address, caller));
            assert(current_staked >= amount, 'Insufficient staked amount');

            // Transfer tokens back to user
            let success = token.transfer(caller, amount);
            assert(success, 'Unstake failed');

            if success {
                self.staked.write((token_address, caller), current_staked - amount);
            }
        }

        fn get_staked(self: @ContractState, token_address: TokenAddress, user_address: UserAddress) -> Amount {
            // simply read the map and return
            self.staked.read((token_address, user_address))
        }
    }
}
