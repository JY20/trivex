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
        // balance: felt252,
        // campaigns: LegacyMap<CampaignID, Campaign>,
        // campaigns_count: u256,
        // donations: LegacyMap<(CampaignID, DonationID), Donation>,
        // guardian: ContractAddress,
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

        fn deposit(ref self: ContractState, user_address: UserAddress, amount: Amount, token_address: TokenAddress) {
            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let transfer_success = token.transferFrom(
                user_address,
                get_contract_address(),
                amount,
            );

            assert(transfer_success, 'Token transfer failed.');
            
            if transfer_success {
                let record = Record {
                    user: user_address, amount: amount, date: get_block_timestamp()
                };
                self.records.write(user_address, record);
                
                let current_balance = self.balance.read();
                let updated_balance = current_balance + amount;
                self.balance.write(updated_balance);
            }
        }

        fn withdraw(ref self: ContractState, user_address: UserAddress, amount: Amount, token_address: TokenAddress) {
            let token: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };

            let transfer_success = token.transfer(user_address, amount);
            assert(transfer_success, 'Token withdrawal failed.');

            if transfer_success {
                let current_balance = self.balance.read();
                let updated_balance = current_balance - amount;
                self.balance.write(updated_balance);
            }
        }
    }
}
