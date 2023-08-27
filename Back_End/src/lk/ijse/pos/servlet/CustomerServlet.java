package lk.ijse.pos.servlet;

import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;

@WebServlet(urlPatterns = {"/customer"})
public class CustomerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "1234");
            PreparedStatement pstm = connection.prepareStatement("SELECT * FROM Customer");
            ResultSet rst = pstm.executeQuery();
            String option = req.getParameter("option");

            resp.setContentType("application/json");
            resp.addHeader("Access-Control-Allow-Origin", "*");
            resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
            resp.addHeader("Access-Control-Allow-Headers", "Content-Type");

            JsonArrayBuilder allCustomers = Json.createArrayBuilder();

            while (rst.next()) {
                String id = rst.getString(1);
                String name = rst.getString(2);
                String address = rst.getString(3);
                String contact = rst.getString(4);

                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("id", id);
                objectBuilder.add("name", name);
                objectBuilder.add("address", address);
                objectBuilder.add("contact", contact);

                allCustomers.add(objectBuilder.build());
            }
            resp.getWriter().print(allCustomers.build());


        } catch (ClassNotFoundException e) {

            resp.setStatus(500);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

        } catch (SQLException e) {

            resp.setStatus(400);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

        }


    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cusID = req.getParameter("cusID");
        String cusName = req.getParameter("cusName");
        String cusAddress = req.getParameter("cusAddress");
        String cusSalary = req.getParameter("cusSalary");

        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");

        try {

            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "1234");

            PreparedStatement pstm = connection.prepareStatement("insert into Customer values(?,?,?,?)");
            pstm.setObject(1, cusID);
            pstm.setObject(2, cusName);
            pstm.setObject(3, cusAddress);
            pstm.setObject(4, cusSalary);

            if (pstm.executeUpdate() > 0) {
                resp.getWriter().print(addJSONObject("Customer Updated !", "ok"));
            } else {
                throw new SQLException();
            }

        } catch (SQLException e) {

            resp.setStatus(400);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

        } catch (ClassNotFoundException e) {

            resp.setStatus(500);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTION");
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");

        JsonReader reader = Json.createReader(req.getReader());
        JsonObject customerOB = reader.readObject();

        String cusID = customerOB.getString("id");
        String cusName = customerOB.getString("name");
        String cusAddress = customerOB.getString("address");
        String cusSalary = customerOB.getString("salary");


        System.out.println(cusID + " - " + cusName+ " - " + cusAddress+ " - " +cusSalary);
        try {

            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "1234");

            PreparedStatement pstm3 = connection.prepareStatement("update Customer set name=?,address=?,contact=? where cusID=?");
            pstm3.setObject(4, cusID);
            pstm3.setObject(1, cusName);
            pstm3.setObject(2, cusAddress);
            pstm3.setObject(3, cusSalary);

            if (pstm3.executeUpdate() > 0) {
                resp.getWriter().print(addJSONObject("Customer Updated !", "ok"));
            }

        } catch (SQLException e) {

            resp.setStatus(400);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

        } catch (ClassNotFoundException e) {

            resp.setStatus(500);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cusID = req.getParameter("cusID");
        System.out.println(cusID);
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "1234");
            PreparedStatement pstm2 = connection.prepareStatement("delete from Customer where cusID=?");
            pstm2.setObject(1, cusID);

            if (pstm2.executeUpdate() > 0) {
                resp.getWriter().print(addJSONObject("Customer deleted !", "ok"));
            }

        } catch (SQLException e) {

            resp.setStatus(400);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

        } catch (ClassNotFoundException e) {

            resp.setStatus(500);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

        }

    }


    private JsonObject addJSONObject(String message, String state) {

        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
        objectBuilder.add("state", state);
        objectBuilder.add("message", message);
        objectBuilder.add("data", "[]");


        return objectBuilder.build();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
