use trivex_contract::interfaces::ITrivexAction;

#[starknet::contract]
mod TrivexAction {
    use trivex_contract::erc20::IERC20DispatcherTrait;
    use core::clone::Clone;
    use trivex_contract::interfaces::ITrivexAction;
    use starknet::{get_caller_address, ContractAddress, get_contract_address, get_block_timestamp};
    use trivex_contract::starkstructs::{Position, order_book_entry};
    use trivex_contract::utils::{UserAddress, TokenAddress, Amount};
    use trivex_contract::erc20::{IERC20Dispatcher};
    use starknet::contract_address_const;
    
    #[storage]
    struct Storage {
        positions: LegacyMap<(UserAddress, u128), Position>,
        user_position_counts: LegacyMap<UserAddress, u128>,
        transactions: LegacyMap<(UserAddress, u128), Position>,
        user_transaction_counts: LegacyMap<UserAddress, u128>,
        staked: LegacyMap<(TokenAddress, UserAddress), Amount>,
        total_staked: Amount,
        user_addresses: LegacyMap<u256, UserAddress>,
        user_addresses_len: u256,
        address_exists: LegacyMap<UserAddress, bool>,
        internal_order_book: LegacyMap<(felt252, u128), Amount>,
        internal_order_book_keys: LegacyMap<u256, (felt252, u128)>,
        internal_order_book_len: u256,
        external_used_balance: u256,
        external_available_balance: u256,
        lender_interest_rate: u256,
        strategy_price: LegacyMap<felt252, u256>,
        strategy_creator: LegacyMap<felt252, UserAddress>
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.lender_interest_rate.write(12_u256);

        let creator = contract_address_const::<0x012B099F50C3CbCc82ccF7Ee557c9d60255c35C359eA6615435B761Ec3336EC8>();
        let key1 = 'averageRebalance';
        self.strategy_price.write(key1, 1_u256);
        self.strategy_creator.write(key1, creator);

        let key2 = 'momentum';
        self.strategy_price.write(key2, 1_u256);
        self.strategy_creator.write(key2, creator);

        let key3 = 'standardDeviation';
        self.strategy_price.write(key3, 1_u256);
        self.strategy_creator.write(key3, creator);

        let key4 = 'coVariance';
        self.strategy_price.write(key4, 1_u256);
        self.strategy_creator.write(key4, creator);
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
            
            let exists = self.address_exists.read(caller);
            if exists == false {
                let index = self.user_addresses_len.read();
                self.user_addresses.write(index, caller);
                self.user_addresses_len.write(index + 1);

                self.address_exists.write(caller, true);
            }

            if transfer_success {
                //adding to positions
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
                
                //adding to transactions
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

                //updating the internal order book
                let current_order_book = self.internal_order_book.read((symbol, leverage));
                if action == 'Open Buy' {
                    self.internal_order_book.write((symbol, leverage), current_order_book + total_value);
                } else if action == 'Open Sell' {
                    self.internal_order_book.write((symbol, leverage), current_order_book - total_value);
                } 

                if current_order_book == 0 {
                    let idx = self.internal_order_book_len.read();
                    self.internal_order_book_keys.write(idx, (symbol, leverage));
                    self.internal_order_book_len.write(idx + 1);
                }
            }
        }

        fn close_order(ref self: ContractState, id: u128, amount: Amount, action: felt252, token_address: TokenAddress) {
            let caller = get_caller_address();

            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let position = self.positions.read((caller, id));
            // let amount = position.total_value;

            let transfer_success = token.transfer(caller, amount);
            assert(transfer_success, 'Token transfer failed.');

            if transfer_success {
                //removing it from positions
                let count = self.user_position_counts.read(caller);
                let mut i = id;
                let temp = self.positions.read((caller, i));
                while i + 1 <= count {
                    let next_pos = self.positions.read((caller, i + 1));
                    self.positions.write((caller, i), next_pos);
                    i = i + 1;
                };
                self.user_position_counts.write(caller, count - 1);

                //adding it to transactions
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

                //updating the internal order book
                let current_order_book = self.internal_order_book.read((temp.symbol, temp.leverage));
                if action == 'Close Buy' {
                    self.internal_order_book.write((temp.symbol, temp.leverage), current_order_book - amount);
                } else if action == 'Close Sell' {
                    self.internal_order_book.write((temp.symbol, temp.leverage), current_order_book + amount);
                } 
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

        fn get_all_user_addresses(self: @ContractState) -> Array<UserAddress> {
            let length = self.user_addresses_len.read();
            let mut addresses = ArrayTrait::new();
            let mut i = 0_u256;

            loop {
                if i == length {
                    break;
                }
                let addr = self.user_addresses.read(i);
                addresses.append(addr);
                i = i + 1;
            };

            addresses
        }

        fn get_internal_order_book(self: @ContractState) -> Array<order_book_entry> {
            let length = self.internal_order_book_len.read();

            let mut entries = ArrayTrait::new();
            let mut i = 0;

            loop {
                if i == length {
                    break;
                }

                let key = self.internal_order_book_keys.read(i);
                let (symbol, leverage) = key;
                let amount = self.internal_order_book.read(key);

                let entry = order_book_entry {
                    symbol: symbol,
                    leverage: leverage,
                    amount: amount
                };

                entries.append(entry);
                i = i + 1;
            };

            entries
        }

        fn run_strategy(ref self: ContractState, strategy: felt252, amount: Amount, token_address: TokenAddress) {
            let caller = get_caller_address();
            let creator = self.strategy_creator.read(strategy);

            let fee_part = amount*20/100;
            let payout_part = amount*80/100;

            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let contract_addr = get_contract_address();
            let transfer1 = token.transferFrom(caller, contract_addr, fee_part);
            assert(transfer1, 'Contract fee transfer failed.');

            let transfer2 = token.transferFrom(caller, creator, payout_part);
            assert(transfer2, 'Creator payout transfer failed.');
        }

        fn get_strategy_price(self: @ContractState, strategy: felt252) -> Amount{
            self.strategy_price.read(strategy)
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

                let current_total_staked = self.total_staked.read();
                self.total_staked.write(current_total_staked + amount);
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
            self.staked.read((token_address, user_address))
        }

        fn get_total_staked(self: @ContractState) -> Amount {
            self.total_staked.read()
        }

        fn get_fee(self: @ContractState, amount: Amount) -> Amount {
            let available_balance = self.external_available_balance.read();
            let part1 = amount / 1000;
            let part2 = if available_balance == 0 {
                (amount / 33)
            } else {
                (amount / 100) / available_balance
            };
            let fee = part1 + part2;

            fee
        }

        fn get_apy(self: @ContractState) -> Amount {
            self.lender_interest_rate.read()
        }
    }
}
