package app.services;

import app.models.Transaction;
import app.models.Wallet;
import app.repo.TransactionRepository;
import app.repo.WalletRepository;
import app.repo.UserRepository;
import app.repo.StudentProfileRepository;
import app.models.User;
import app.models.StudentProfile;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    public WalletService(
            WalletRepository walletRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository) {

        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public Wallet getWallet(Long userId) {

        return walletRepository.findByUserId(userId);
    }

    public Wallet addMoney(Long userId, double amount) {

        Wallet wallet =
                walletRepository.findByUserId(userId);

        if (wallet == null) {
            throw new RuntimeException("Wallet not found");
        }

        if (amount <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        wallet.setBalance(
                wallet.getBalance() + amount
        );

        walletRepository.save(wallet);

        Transaction transaction = new Transaction();

        transaction.setUserId(userId);
        transaction.setType("RECEIVE");
        transaction.setAmount(amount);
        transaction.setAddress(wallet.getAddress());
        transaction.setCategory("OTHER");
        transaction.setNote("Demo wallet top-up");
        transaction.setDate(LocalDateTime.now());

        transactionRepository.save(transaction);

        return wallet;
    }

    public Wallet sendMoney(
            Long userId,
            String address,
            double amount,
            String category,
            String note) {

        Wallet sender =
                walletRepository.findByUserId(userId);

        Wallet receiver =
                walletRepository.findByAddress(address);

        if (sender == null) {
            throw new RuntimeException(
                    "Sender wallet not found"
            );
        }

        if (receiver == null) {
            throw new RuntimeException(
                    "Receiver wallet not found"
            );
        }

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "Cannot send to yourself"
            );
        }

        if (amount <= 0) {
            throw new RuntimeException(
                    "Invalid amount"
            );
        }

        if (sender.getBalance() < amount) {
            throw new RuntimeException(
                    "Insufficient balance"
            );
        }

        sender.setBalance(
                sender.getBalance() - amount
        );

        receiver.setBalance(
                receiver.getBalance() + amount
        );

        walletRepository.save(sender);
        walletRepository.save(receiver);

        Transaction send =
                new Transaction();

        send.setUserId(userId);
        send.setType("SEND");
        send.setAmount(amount);
        send.setAddress(address);
        send.setCategory(normalizeCategory(category));
        send.setNote(cleanNote(note));
        send.setDate(LocalDateTime.now());

        transactionRepository.save(send);

        Transaction receive =
                new Transaction();

        receive.setUserId(receiver.getUserId());
        receive.setType("RECEIVE");
        receive.setAmount(amount);
        receive.setAddress(sender.getAddress());
        receive.setCategory(normalizeCategory(category));
        receive.setNote(cleanNote(note));
        receive.setDate(LocalDateTime.now());

        transactionRepository.save(receive);

        return sender;
    }

    public Map<String, Object> findRecipient(String address) {
        Map<String, Object> result = new HashMap<>();
        Wallet wallet = walletRepository.findByAddress(address);
        if (wallet == null) {
            result.put("found", false);
            result.put("message", "Wallet address not found");
            return result;
        }
        User user = userRepository.findById(wallet.getUserId()).orElse(null);
        StudentProfile profile = studentProfileRepository.findByUserId(wallet.getUserId());
        result.put("found", true);
        result.put("name", user != null ? user.getName() : "Student");
        result.put("address", wallet.getAddress());
        if (profile != null) {
            result.put("studentId", profile.getStudentId());
            result.put("department", profile.getDepartment());
            result.put("year", profile.getYear());
        }
        return result;
    }

    // Phase 2: student/campus payment history
    public List<Transaction> getTransactions(Long userId) {

        return transactionRepository
                .findByUserIdOrderByDateDesc(userId);
    }

    private String cleanNote(String note) {
        if (note == null) return "";
        String value = note.trim();
        return value.length() > 100 ? value.substring(0, 100) : value;
    }

    private String normalizeCategory(String category) {
        if (category == null || category.isBlank()) {
            return "OTHER";
        }

        String value = category.trim().toUpperCase();
        if (value.equals("CANTEEN") || value.equals("TRANSPORT") ||
                value.equals("COLLEGE STORE") || value.equals("PRINTING") ||
                value.equals("EVENTS") || value.equals("EDUCATION") ||
                value.equals("OTHER")) {
            return value;
        }

        return "OTHER";
    }
}