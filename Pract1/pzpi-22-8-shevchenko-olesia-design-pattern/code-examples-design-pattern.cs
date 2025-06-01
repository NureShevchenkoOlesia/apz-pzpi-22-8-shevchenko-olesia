//example 1
// Інтерфейс стратегії
interface PaymentStrategy {
    void pay(int amount);
}

// Реалізація для оплати кредитною карткою
class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Оплата кредитною карткою: " + amount + " грн");
    }
}

// Реалізація для PayPal
class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Оплата через PayPal: " + amount + " грн");
    }
}

// Контекст
class PaymentContext {
    private PaymentStrategy strategy;
    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    public void executePayment(int amount) {
        strategy.pay(amount);
    }
}

//example 2
interface CompressionStrategy {
    void compress(String fileName);
}

class ZipCompression implements CompressionStrategy {
    public void compress(String fileName) {
        System.out.println("Стиснення файлу у формат ZIP: " + fileName);
    }
}

class RarCompression implements CompressionStrategy {
    public void compress(String fileName) {
        System.out.println("Стиснення файлу у формат RAR: " + fileName);
    }
}

class CompressionContext {
    private CompressionStrategy strategy;
    public void setStrategy(CompressionStrategy strategy) {
        this.strategy = strategy;
    }
    public void executeCompression(String fileName) {
        strategy.compress(fileName);
    }
}
