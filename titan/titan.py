from starknet_py.contract import Contract
import asyncio
from starknet_py.net.full_node_client import FullNodeClient
from trader.hyperliquidTrader import hyperliquidTrader
import math

contract_address = "0x05083aa7aba0aa78514ac84d70a7c969360a6095189d2fdfaafcb689b4734d38"

async def get_all_user_addresses(contract):
    addresses_result = await contract.functions["get_all_user_addresses"].call()
    addresses = addresses_result[0]
    hex_addresses = ["0x" + hex(addr)[2:].rjust(64, "0") for addr in addresses]
    return hex_addresses

async def get_internal_order_book(contract):
    order_book_result = await contract.functions["get_internal_order_book"].call()
    order_book_raw = order_book_result[0]

    order_book_cleaned = []
    for order in order_book_raw:
        symbol_int = order['symbol']
        try:
            symbol_str = bytes.fromhex(hex(symbol_int)[2:]).decode('utf-8').rstrip('\x00')
        except:
            symbol_str = str(symbol_int)
        cleaned_order = {
            'symbol': symbol_str,
            'leverage': order['leverage'],
            'amount': order['amount'] / 1_000_000
        }
        order_book_cleaned.append(cleaned_order)

    return order_book_cleaned

def dynamic_round(num, size):
    if num == 0:
        return 0
    abs_num = abs(num)
    
    if abs_num >= 1:
        digits_before_decimal = int(math.log10(abs_num)) + 1
    else:
        digits_before_decimal = 0 
    decimal_places = max(1, digits_before_decimal)  
    return float(round(size, decimal_places))

async def external_hedge(orders):
    trader = hyperliquidTrader()
    exchange = trader.getExchange()
    info = trader.getInfo()
    external_balance = info["marginSummary"]["accountValue"]

    print(external_balance)

    for order in orders:
        print("************************************")
        print(f"Order — Symbol: {order['symbol']}, Amount: {order['amount']}, Leverage: {order['leverage']}")
        symbol = order["symbol"]
        price = trader.getCurrentPrice(order["symbol"])
        price = float(price)
        print(f"{symbol} price: {price}")
        amount = order["amount"]
        amount = float(amount)
        leverage = order['leverage']
        size = dynamic_round(price, leverage*amount/price)
        print(f"{symbol} size: {size}")
        # trader.updateLeverage(exchange, leverage, symbol)
        # trader.openOrder(True, symbol, size, exchange)
        print("************************************")

async def main():
    client = FullNodeClient(node_url="https://starknet-sepolia.public.blastapi.io")
    contract = await Contract.from_address(contract_address, client)

    addresses = await get_all_user_addresses(contract)
    print("User Addresses:", addresses)

    order_book = await get_internal_order_book(contract)
    print("Internal Order Book:", order_book)

    await external_hedge(order_book)

asyncio.run(main())
