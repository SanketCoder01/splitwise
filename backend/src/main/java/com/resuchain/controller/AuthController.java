package com.resuchain.controller;

import com.resuchain.dto.JwtResponse;
import com.resuchain.dto.LoginRequest;
import com.resuchain.dto.RegisterRequest;
import com.resuchain.model.User;
import com.resuchain.security.JwtTokenUtil;
import com.resuchain.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Validate captcha (in real implementation, you'd validate against session)
            if (!"gGqOe6".equals(loginRequest.getCaptcha())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid captcha"));
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtTokenUtil.generateToken(userDetails);

            User user = userService.findByEmail(loginRequest.getEmail()).orElseThrow();

            return ResponseEntity.ok(new JwtResponse(jwt, 
                                                   user.getId(),
                                                   user.getEmail(), 
                                                   user.getFullName(),
                                                   user.getUserType().toString()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Validate captcha
            if (!"gGqOe6".equals(registerRequest.getCaptcha())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid captcha"));
            }

            // Validate password confirmation
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Passwords do not match"));
            }

            // Check if user already exists
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Email is already taken"));
            }

            if (userService.existsByPhone(registerRequest.getPhone())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Phone number is already taken"));
            }

            // Create new user
            User user = new User();
            user.setFullName(registerRequest.getFullName());
            user.setEmail(registerRequest.getEmail());
            user.setPhone(registerRequest.getPhone());
            user.setPassword(registerRequest.getPassword());
            
            if ("student".equalsIgnoreCase(registerRequest.getUserType())) {
                user.setUserType(UserType.STUDENT);
            } else {
                user.setUserType(UserType.ORGANIZATION);
                user.setOrganizationName(registerRequest.getOrganizationName());
                user.setOrganizationId(registerRequest.getOrganizationId());
            }

            User savedUser = userService.createUser(user);

            return ResponseEntity.ok(new MessageResponse("User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                if (jwtTokenUtil.validateToken(jwtToken)) {
                    String username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                    User user = userService.findByEmail(username).orElseThrow();
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("user", new JwtResponse(jwtToken, 
                                                       user.getId(),
                                                       user.getEmail(), 
                                                       user.getFullName(),
                                                       user.getUserType().toString()));
                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid token"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Token validation failed"));
        }
    }

    // Helper class for response messages
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}

// Import the UserType enum
import com.resuchain.model.UserType;
