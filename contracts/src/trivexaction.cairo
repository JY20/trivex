use trivex_contract::interfaces::ITrivexAction;

#[starknet::contract]
mod TrivexAction {
    use trivex_contract::erc20::IERC20DispatcherTrait;
    use core::clone::Clone;
    use trivex_contract::interfaces::ITrivexAction;
    use starknet::{get_caller_address, ContractAddress, get_contract_address, get_block_timestamp};
    use trivex_contract::starkstructs::{Record};
    use trivex_contract::utils::{UserAddress, TokenAddress, Amount};
    use trivex_contract::erc20::{IERC20Dispatcher};
    
    #[storage]
    struct Storage {
        records: LegacyMap<UserAddress, Record>,
        balance: u256,
    }

    #[abi(embed_v0)]
    impl TrivexActionImpl of super::ITrivexAction<ContractState> {
        fn get_balance(self: @ContractState, token_address: TokenAddress, agent_address: UserAddress) -> Amount {
            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            token.balanceOf(agent_address)
        }

        fn deposit(ref self: ContractState, amount: Amount, token_address: TokenAddress) {
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
            
            if transfer_success {
                let record = Record {
                    user: caller, amount: amount, date: get_block_timestamp()
                };
                self.records.write(caller, record);
                
                let current_balance = self.balance.read();
                let updated_balance = current_balance + amount;
                self.balance.write(updated_balance);
            }
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

        fn withdraw(ref self: ContractState, amount: Amount, token_address: TokenAddress) {
            let caller = get_caller_address();

            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let transfer_success = token.transfer(caller, amount);
            assert(transfer_success, 'Token withdrawal failed.');

            if transfer_success {
                let current_balance = self.balance.read();
                let updated_balance = current_balance - amount;
                self.balance.write(updated_balance);
            }
        }
    }
}
