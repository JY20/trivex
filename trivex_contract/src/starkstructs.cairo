use starknet::ContractAddress;
use trivex_contract::utils::{Amount, UserAddress, TokenAddress};

#[derive(Copy, Serde, Drop, starknet::Store)]
pub struct Position {
    pub id: u128,
    pub symbol: felt252,
    pub quantity: u256,
    pub average_price: u256,
    pub leverage: u128,
    pub total_value: u256,
    pub action: felt252,
    pub datetime: u64
}

#[derive(Copy, Serde, Drop, starknet::Store)]
pub struct order_book_entry {
    pub symbol: felt252,
    pub leverage: u128,
    pub amount: Amount
}

#[derive(Copy, Serde, Drop, starknet::Store)]
pub struct history_entry {
    pub strategy: felt252,       
    pub amount: Amount, 
    pub datetime: u64   
}