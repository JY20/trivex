use trivex_contract::starkstructs::{Position, order_book_entry};
use starknet::ContractAddress;
use trivex_contract::utils::{UserAddress, Amount, TokenAddress};

#[starknet::interface]
pub trait ITrivexAction<TContractState> {
    fn get_balance(self: @TContractState, token_address: TokenAddress, agent_address: UserAddress)-> Amount;
    fn open_order(ref self: TContractState, symbol: felt252, quantity: u256, average_price: u256, leverage: u128, total_value: u256, action: felt252, token_address: TokenAddress);
    fn close_order(ref self: TContractState, id: u128, amount: Amount, action: felt252, token_address: TokenAddress);
    fn get_positions(self: @TContractState, user: UserAddress) -> Array<Position>;
    fn get_transactions(self: @TContractState, user: UserAddress) -> Array<Position>;
    fn get_all_user_addresses(self: @TContractState) -> Array<UserAddress>;
    fn get_internal_order_book(self: @TContractState) -> Array<order_book_entry>;
    fn run_strategy(ref self: TContractState, strategy: felt252, amount: Amount, token_address: TokenAddress);
    fn get_strategy_price(self: @TContractState, strategy: felt252) -> Amount;
    fn stake(ref self: TContractState, amount: Amount, token_address: TokenAddress);
    fn unstake(ref self: TContractState, amount: Amount, token_address: TokenAddress);
    fn get_staked(self: @TContractState, token_address: TokenAddress, user_address: UserAddress) -> Amount;
    fn get_total_staked(self: @TContractState) -> Amount;
    fn get_fee(self: @TContractState, amount: Amount) -> Amount;
    fn get_apy(self: @TContractState) -> Amount;
}