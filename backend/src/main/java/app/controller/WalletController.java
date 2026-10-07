package app.controller;

import app.models.Transaction;
import app.models.Wallet;
import app.services.WalletService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/{userId}")
    public Wallet getWallet(@PathVariable Long userId) {
        return walletService.getWallet(userId);
    }

    @PostMapping("/{userId}/add")
    public Wallet addMoney(@PathVariable Long userId, @RequestParam double amount) {
        return walletService.addMoney(userId, amount);
    }

    @GetMapping("/recipient")
    public Map<String, Object> findRecipient(@RequestParam String address) {
        return walletService.findRecipient(address);
    }

    @PostMapping("/{userId}/send")
    public Wallet sendMoney(
            @PathVariable Long userId,
            @RequestParam String address,
            @RequestParam double amount,
            @RequestParam(defaultValue = "OTHER") String category,
            @RequestParam(defaultValue = "") String note) {
        return walletService.sendMoney(userId, address, amount, category, note);
    }

    @GetMapping("/{userId}/transactions")
    public List<Transaction> getTransactions(@PathVariable Long userId) {
        return walletService.getTransactions(userId);
    }
}
