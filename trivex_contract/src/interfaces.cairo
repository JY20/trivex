use trivex_contract::starkstructs::{Position};
use starknet::ContractAddress;
use trivex_contract::utils::{UserAddress, Amount, TokenAddress};

#[starknet::interface]
pub trait ITrivexAction<TContractState> {
    fn get_balance(self: @TContractState, token_address: TokenAddress, agent_address: UserAddress)-> Amount;
    fn open_order(ref self: TContractState, symbol: felt252, quantity: u256, average_price: u256, leverage: u128, total_value: u256, action: felt252, token_address: TokenAddress);
    fn close_order(ref self: TContractState, id: u128, amount: Amount, action: felt252, token_address: TokenAddress);
    fn get_positions(self: @TContractState, user: UserAddress) -> Array<Position>;
    fn get_transactions(self: @TContractState, user: UserAddress) -> Array<Position>;
    fn run_strategy(ref self: TContractState, amount: Amount, token_address: TokenAddress);
    fn stake(ref self: TContractState, amount: Amount, token_address: TokenAddress);
    fn unstake(ref self: TContractState, amount: Amount, token_address: TokenAddress);
    fn get_staked(self: @TContractState, token_address: TokenAddress, user_address: UserAddress) -> Amount;
}