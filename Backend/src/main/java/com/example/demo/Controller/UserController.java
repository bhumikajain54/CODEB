package com.example.demo.Controller;

import com.example.demo.DTO.ApiResponse;
import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Security.JwtTokenProvider;
import com.example.demo.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService,
                          UserRepository userRepository,
                          AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse> rootHealthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("Server is running successfully", null));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("Auth controller is reachable", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        try {
            // --- Input validation ---
            if (user.getFullName() == null || user.getFullName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error(400, "Full name is required"));
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error(400, "Email is required"));
            }
            if (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error(400, "Password is required"));
            }

            // --- Duplicate email check ---
            if (userRepository.findByEmail(user.getEmail().trim()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error(409, "An account with this email already exists"));
            }

            // --- Register user (hashing + email verification handled in service) ---
            User registeredUser = userService.registerUser(user);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", registeredUser.getId());
            data.put("email", registeredUser.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(201,
                            "Registration successful. Please check your email to verify your account.",
                            data));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "An unexpected error occurred. Please try again later."));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) {
        boolean verified = userService.verifyEmail(token);
        if (verified) {
            return ResponseEntity.ok(
                    ApiResponse.success("Email verified successfully. You can now login.", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Invalid or expired verification token"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody Map<String, String> loginRequest,
                                             HttpServletRequest request) {
        try {
            // Clear any existing authentication
            SecurityContextHolder.clearContext();

            // Authenticate the user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("email"),
                            loginRequest.get("password")
                    )
            );

            // Set the authentication in the SecurityContext
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Generate the JWT token
            String token = jwtTokenProvider.generateToken(auth);

            // Get the user's role
            String role = auth.getAuthorities().stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User has no roles assigned"))
                    .getAuthority()
                    .replace("ROLE_", "");

            // Get user details
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String email = userDetails.getUsername();

            // Invalidate any existing session and create a new one
            request.getSession().invalidate();
            request.getSession(true);

            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("role", role);
            data.put("email", email);

            return ResponseEntity.ok(ApiResponse.success("Login successful", data));

        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(403, "Account not verified. Please check your email to verify your account."));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Invalid email or password"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletRequest request) {
        try {
            SecurityContextHolder.clearContext();
            request.getSession().invalidate();
            return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Logout failed"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Email is required"));
        }

        userService.forgotPassword(email);

        // Always return success to prevent email enumeration attacks
        return ResponseEntity.ok(ApiResponse.success(
                "If the email address exists in our system, you will receive password reset instructions",
                null));
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse> validateResetToken(@RequestParam String token) {
        boolean isValid = userService.validateResetToken(token);

        if (isValid) {
            return ResponseEntity.ok(ApiResponse.success("Token is valid", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Invalid or expired token"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Reset token is required"));
        }

        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "New password is required"));
        }

        boolean success = userService.resetPassword(token, newPassword);

        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Failed to reset password. Invalid or expired token"));
        }
    }
}