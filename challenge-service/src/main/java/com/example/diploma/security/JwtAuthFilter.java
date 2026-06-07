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
        System.out.println("DEBUG: Request URL: " + request.getRequestURI());
        System.out.println("DEBUG: Auth header: " + auth);

        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                String token = auth.substring(7);
                Claims claims = jwtService.parse(token);

                String email = claims.getSubject();
                String role = String.valueOf(claims.get("role"));

                System.out.println("DEBUG: Token parsed. Email: " + email + ", Role: " + role);

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                var authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                System.out.println("DEBUG: Token validation failed: " + e.getMessage());
            }
        } else {
            System.out.println("DEBUG: No valid Bearer token found");
        }

        filterChain.doFilter(request, response);
    }
}