from trycourier import Courier 
from configparser import ConfigParser

class alert:
    def __init__(self, logger):
        self.config = ConfigParser()
        self.config.read("./config/config.ini")
        self.client = Courier(auth_token="dk_prod_ZC8EG09G6BMB94MEGBFNVRX9SFN6")
        self.toEmails = self.config.get("EmailConfig", "to_emails").split(",")
        self.priceLimit = int(self.config.get("StrategyConfig", "price_limit"));
        self.action = str(self.config.get("StrategyConfig", "action"));
        self.logger = logger

    def setEmail(self, email):
         self.toEmails = [email]

    def emailMomentum(self, subject, signal, result):
        body = ""
        body += "Top "+str(signal)+":\n"
        for key, value in result.items():
            body += "\t"+str(key)+" : "+str(value)
            body += "\n"
        self.send_email(subject, body)

    def emailAgg(self, subject, buySignals, sellSignals):
        body = ""
        body += "Buy Signals:\n"
        for value in buySignals:
            if(int(round(buySignals[value], 2))  < self.priceLimit):
                if(self.action == "highlight"):
                    body += "\t"+str(value)+" : "+str(round(buySignals[value], 2))
                    body += " [High Risk]\n"
                else:
                    self.logger.info("high risk symbol: "+str(value)+" : "+str(round(buySignals[value], 2)))
            else:
                body += "\t"+str(value)+" : "+str(round(buySignals[value], 2))+"\n"
        body += "\n"
        body += "Sell Signals:\n"
        for value in sellSignals:
            if(int(round(sellSignals[value], 2) < self.priceLimit)):
                if(self.action == "highlight"):
                    body += "\t"+str(value)+" : "+str(round(sellSignals[value], 2))
                    body += " [High Risk]\n"
                else:
                    self.logger.info("high risk symbol: "+str(value)+" : "+str(round(sellSignals[value], 2)))
            else:
                body += "\t"+str(value)+" : "+str(round(sellSignals[value], 2))+"\n"
        body += "\n"
        self.send_email(subject, body)

    def send_email(self, subject, body):
        for email in self.toEmails:
            self.logger.info(email)
            response = self.client.send( 
                event="Q5WTGPFQ01M9CKJ5Z3R1JQP2ZKEP", 
                recipient="mason", 
                profile={ 
                    "email": email
                }, 
                data={ 
                    "subject": subject,
                    "message": body
                }
            )

            self.logger.info(response['messageId'])
