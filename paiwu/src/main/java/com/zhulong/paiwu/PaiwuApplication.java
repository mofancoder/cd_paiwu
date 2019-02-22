package com.zhulong.paiwu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
@Controller
public class PaiwuApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaiwuApplication.class, args);
	}

	@RequestMapping("/login")
	public String login(){
		return "/login.html";
	}
}
