import freecurrencyapi

client = freecurrencyapi.Client('freecurrencyapikey')

def get_currencies(currencies: list):
    result = client.currencies(currencies=currencies)
    return result

def get_lastest(base_currency: str, currencies: list):
    result = client.latest(base_currency=base_currency ,currencies=currencies)
    return result


def get_available_currencies():
    currensies = get_currencies([])['data']
    answer = [i for i in currensies]
    sorted_answer = sorted(answer)
    return sorted_answer
