use starknet::ContractAddress;
use trivex_contract::utils::{Amount, UserAddress, TokenAddress};

#[derive(Copy, Serde, Drop, starknet::Store)]
pub struct Record {
    pub user: UserAddress,
    pub amount: Amount,
    pub date: u64
}