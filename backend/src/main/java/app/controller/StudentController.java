package app.controller;

import app.models.StudentProfile;
import app.repo.StudentProfileRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentProfileRepository repository;

    public StudentController(StudentProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{userId}")
    public StudentProfile getProfile(@PathVariable Long userId) {
        StudentProfile profile = repository.findByUserId(userId);
        if (profile == null) {
            throw new RuntimeException("Student profile not found");
        }
        return profile;
    }

    @PutMapping("/{userId}")
    public StudentProfile saveProfile(
            @PathVariable Long userId,
            @RequestBody StudentProfile request) {

        StudentProfile profile = repository.findByUserId(userId);
        if (profile == null) {
            profile = new StudentProfile();
            profile.setUserId(userId);
        }

        profile.setStudentId(request.getStudentId());
        profile.setDepartment(request.getDepartment());
        profile.setYear(request.getYear());
        profile.setCollege(request.getCollege());

        return repository.save(profile);
    }
}
