package com.example.diploma.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                Claims claims = jwtService.parse(token);
                String email = claims.getSubject();
                Object roleObj = claims.get("role");

                System.out.println("JWT Filter - Email: " + email + ", Raw Role from Token: " + roleObj);

                if (roleObj != null) {
                    String role = String.valueOf(roleObj);
                    String finalRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                    var authorities = List.of(new SimpleGrantedAuthority(finalRole));
                    var authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.out.println("JWT Filter - Authorities set: " + authorities);
                }
            } catch (Exception e) {
                System.err.println("JWT Filter - Error parsing token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}