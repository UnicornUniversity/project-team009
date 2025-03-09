package com.wineProject.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.util.Date;

@Component
public class JwtUtil {

    private final String keystorePassword;
    private final String keyPassword;
    private final String keyAlias;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    // ✅ Použití konstruktorové injekce pro správné načtení hodnot z application.properties
    public JwtUtil(
            @Value("${server.ssl.key-store-password}") String keystorePassword,
            @Value("${server.ssl.key-password}") String keyPassword,
            @Value("${server.ssl.key-alias}") String keyAlias
    ) {
        this.keystorePassword = keystorePassword;
        this.keyPassword = keyPassword;
        this.keyAlias = keyAlias;
        loadKeys();  // 🛠️ Klíče se načtou až po inicializaci hodnot
    }

    private void loadKeys() {
        try (InputStream is = new ClassPathResource("keystore.p12").getInputStream()) {


            KeyStore keystore = KeyStore.getInstance("PKCS12");
            keystore.load(is, keystorePassword.toCharArray());

            this.privateKey = (PrivateKey) keystore.getKey(keyAlias, keyPassword.toCharArray());
            Certificate cert = keystore.getCertificate(keyAlias);
            this.publicKey = cert.getPublicKey();

            System.out.println("🔓 Klíče úspěšně načteny!");

        } catch (Exception e) {
            throw new RuntimeException("❌ Chyba při načítání klíčů z keystore", e);
        }
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public String extractEmail(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();

        return expiration.before(new Date());
    }
}
