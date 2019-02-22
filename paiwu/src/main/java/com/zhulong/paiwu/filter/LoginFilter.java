package com.zhulong.paiwu.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author MOFAN889
 * @ProjectName com.zhulong.paiwu.filter
 * @Description: TODO
 * @date 2019-2-22 21:14
 */
public class LoginFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("filter");
        /*HttpServletResponse response=(HttpServletResponse)servletResponse;
        response.sendRedirect("http://localhost:8081/login.html");*/
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
