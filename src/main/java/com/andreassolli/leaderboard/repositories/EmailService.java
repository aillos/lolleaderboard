package com.andreassolli.leaderboard.repositories;

import com.andreassolli.leaderboard.models.MailForm;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String myEmailAddress;

    public void sendSimpleMessage(MailForm mailForm) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailForm.getEmail());
        message.setTo(myEmailAddress);
        message.setSubject("New Contact Request from " + mailForm.getName());
        message.setText("From: " + mailForm.getName() + " (" + mailForm.getEmail() + ")\n\n" + mailForm.getMessage());
        mailSender.send(message);
    }
}
