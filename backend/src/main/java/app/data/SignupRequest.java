package app.data;

public class SignupRequest {

    private String name;
    private String email;
    private String password;
    private String studentId;
    private String department;
    private String year;
    private String college;

    public SignupRequest() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
}
