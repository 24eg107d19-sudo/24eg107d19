package app.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.data.SignupRequest;
import app.models.User;
import app.models.Wallet;
import app.repo.UserRepository;
import app.repo.WalletRepository;
import app.repo.StudentProfileRepository;
import app.models.StudentProfile;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final String SUCCESS_KEY = "success";
    private static final String MESSAGE_KEY = "message";

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final StudentProfileRepository studentProfileRepository;

    public AuthController(
            UserRepository userRepository,
            WalletRepository walletRepository,
            StudentProfileRepository studentProfileRepository) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(
            @RequestBody SignupRequest request) {

        Map<String, Object> result = new HashMap<>();

        User existingUser =
                userRepository.findByEmail(request.getEmail());

        if (existingUser != null) {

            result.put(SUCCESS_KEY, false);
            result.put(MESSAGE_KEY, "Email already registered");

            return result;
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User savedUser =
                userRepository.save(user);


        Wallet wallet = new Wallet();

        wallet.setUserId(savedUser.getId());
        wallet.setAddress("WALLET-" + savedUser.getId());
        wallet.setBalance(0);

        walletRepository.save(wallet);

        StudentProfile profile = new StudentProfile();
        profile.setUserId(savedUser.getId());
        profile.setStudentId(request.getStudentId());
        profile.setDepartment(request.getDepartment());
        profile.setYear(request.getYear());
        profile.setCollege(request.getCollege());
        studentProfileRepository.save(profile);

        result.put(SUCCESS_KEY, true);
        result.put(MESSAGE_KEY, "Account created successfully");
        result.put("id", savedUser.getId());
        result.put("name", savedUser.getName());
        result.put("email", savedUser.getEmail());
        result.put("address", wallet.getAddress());

        return result;
    }


    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody SignupRequest request) {

        Map<String, Object> result = new HashMap<>();

        User user =
                userRepository.findByEmail(request.getEmail());

        if (user == null ||
                !user.getPassword().equals(request.getPassword())) {

            result.put(SUCCESS_KEY, false);
            result.put(MESSAGE_KEY, "Invalid email or password");

            return result;
        }

        result.put(SUCCESS_KEY, true);
        result.put(MESSAGE_KEY, "Login successful");
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());

        return result;
    }
}