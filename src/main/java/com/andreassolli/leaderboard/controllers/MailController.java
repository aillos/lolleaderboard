package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.models.MailForm;
import com.andreassolli.leaderboard.repositories.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/api/sendMail")
    public void sendMail(@RequestBody MailForm mailForm) {
        emailService.sendSimpleMessage(mailForm);
    }

    @PostMapping("/api/sendMail/add")
    public void sendMailAdd(@RequestBody MailForm mailForm) {
        emailService.sendSimpleMessageAdd(mailForm);
    }

    @PostMapping("/api/sendMail/remove")
    public void sendMailRemove(@RequestBody MailForm mailForm) {
        emailService.sendSimpleMessageRemove(mailForm);
    }

}

