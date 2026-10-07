package app.repo;

import app.models.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Wallet findByUserId(Long userId);

    Wallet findByAddress(String address);
}