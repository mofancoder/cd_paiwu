package com.zhulong.paiwu.filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * @author MOFAN889
 * @ProjectName com.zhulong.paiwu.filter
 * @Description: 拦截器初始化
 * @date 2019-2-22 20:55
 */
@Configuration
public class WebConfig {

/**
     * 注册过滤器,有两种方式：
     * 1) 使用 @Component 注解<br>
     * 2) 添加到过滤器链中，此方式适用于使用第三方的过滤器。将过滤器写到 WebConfig 类中，如下：
     */

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {

        FilterRegistrationBean registrationBean = new FilterRegistrationBean();

        LoginFilter filter = new LoginFilter();
        registrationBean.setFilter(filter);

        //设置过滤器拦截请求
        List<String> urls = new ArrayList<>();
        urls.add("/login");
        registrationBean.setUrlPatterns(urls);
        return registrationBean;
    }


}
