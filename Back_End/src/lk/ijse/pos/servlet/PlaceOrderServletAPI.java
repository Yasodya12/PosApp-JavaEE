package lk.ijse.pos.servlet;

import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;

@WebServlet(urlPatterns = "/placeOrder")
public class PlaceOrderServletAPI extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");

        String option = req.getParameter("option");


        switch (option) {
            case "customer":

                String cusID = req.getParameter("id");
                resp.getWriter().print(getCustomer(cusID));
                break;
            case "items":

                String itemID = req.getParameter("id");
                resp.getWriter().print(getItem(itemID));
                break;
            case "orders":

                try {
                    Class.forName("com.mysql.cj.jdbc.Driver");
                    Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "1234");
                    PreparedStatement pstm = connection.prepareStatement("select orders.orderID,orders.date,c.name ,orders.total  from orders join customerinfo c on c.cusID = orders.customerID");
                    ResultSet rst = pstm.executeQuery();

                    JsonArrayBuilder allOrders = Json.createArrayBuilder();

                    while (rst.next()) {

                        String id = rst.getString(1);
                        String date = rst.getString(2);
                        String name = rst.getString(3);
                        String total = rst.getString(4);

                        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                        objectBuilder.add("id", id);
                        objectBuilder.add("date", date);
                        objectBuilder.add("name", name);
                        objectBuilder.add("total", total);

                        allOrders.add(objectBuilder.build());
                    }
                    resp.getWriter().print(allOrders.build());


                } catch (ClassNotFoundException e) {

                    resp.setStatus(500);
                    resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

                } catch (SQLException e) {

                    resp.setStatus(400);
                    resp.getWriter().print(addJSONObject(e.getMessage(), "error"));

                }

                break;
        }

    }

    public JsonObject getCustomer(String customerId) {

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/webpos?allowPublicKeyRetrieval=true&useSSL=false", "root", "1234");
            PreparedStatement pstm = connection.prepareStatement("select * from Customer where cusID=?");
            pstm.setObject(1, customerId);
            ResultSet rst = pstm.executeQuery();

            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            if (rst.next()) {

                String id = rst.getString(1);
                String name = rst.getString(2);
                String address = rst.getString(3);
                String contact = rst.getString(4);


                objectBuilder.add("id", id);
                objectBuilder.add("name", name);
                objectBuilder.add("address", address);
                objectBuilder.add("contact", contact);

                System.out.println(id + " " + name + " " + address + " " + contact);

            }

            return objectBuilder.build();

        } catch (ClassNotFoundException e) {

            throw new RuntimeException();

        } catch (SQLException e) {
            throw new RuntimeException();
        }
    }

    public JsonObject getItem(String customerId) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/webpos?allowPublicKeyRetrieval=true&useSSL=false", "root", "1234");
            PreparedStatement pstm = connection.prepareStatement("select * from Item where itemID=?");
            pstm.setObject(1, customerId);
            ResultSet rst = pstm.executeQuery();

            /*connection.setAutoCommit(false);
            connection.commit();
            connection.setAutoCommit(true);*/

            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            if (rst.next()) {

                String id = rst.getString(1);
                String desc = rst.getString(2);
                String price = rst.getString(3);
                String qty = rst.getString(4);

                objectBuilder.add("id", id);
                objectBuilder.add("desc", desc);
                objectBuilder.add("price", price);
                objectBuilder.add("qty", qty);

            }

            return objectBuilder.build();

        } catch (ClassNotFoundException e) {

            throw new RuntimeException();

        } catch (SQLException e) {
            throw new RuntimeException();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");

        JsonReader reader = Json.createReader(req.getReader());
        JsonObject readObject = reader.readObject();

        String orderID = readObject.getString("orderID");
        String date = readObject.getString("date");
        int amount = readObject.getInt("amount");
        String customerID = readObject.getString("customer");

        JsonArray details = readObject.getJsonArray("details");

        for (JsonValue item : details) {

            System.out.println(item.asJsonObject().getString("id"));
            System.out.println(item.asJsonObject().getString("desc"));
            System.out.println(item.asJsonObject().getString("qty"));
            System.out.println(item.asJsonObject().getString("up"));

        }

        try {
            //resp.getWriter().print(placeOrder(orderID,date,amount,customerID,details));

            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "1234");

            try {
                connection.setAutoCommit(false);

                PreparedStatement pstm = connection.prepareStatement("insert into orders values(?,?,?,?)");
                pstm.setObject(1, orderID);
                pstm.setObject(2, date);
                pstm.setObject(3, amount);
                pstm.setObject(4, customerID);

                if (pstm.executeUpdate() > 0) {

                    int i=0;
                    for (JsonValue item : details) {
                        PreparedStatement pstm2 = connection.prepareStatement("insert into ordersdetails values(?,?,?,?)");
                        pstm2.setObject(1, orderID);
                        pstm2.setObject(2, item.asJsonObject().getString("id"));
                        pstm2.setObject(3, item.asJsonObject().getString("qty"));
                        pstm2.setObject(4, item.asJsonObject().getString("up"));

                        System.out.println(details.size());

                        if (pstm2.executeUpdate() > 0) {
                            i++;
                            if (i==details.size()){
                                connection.commit();
                                resp.getWriter().print(addJSONObject("Added", "ok"));
                            }
                        }
                    }

                }

                connection.rollback();
                resp.getWriter().print(addJSONObject("Order couldn't Placed !", "error"));
                //return addJSONObject("Order couldn't Placed !", "error");
            } finally {
                connection.setAutoCommit(true);
            }


        }catch (SQLException e){
            resp.setStatus(400);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));
        }catch (ClassNotFoundException e){
            resp.setStatus(500);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));
        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");

        JsonReader reader = Json.createReader(req.getReader());
        JsonArray jsonValues = reader.readArray();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/webpos?allowPublicKeyRetrieval=true&useSSL=false", "root", "1234");

            for (JsonValue item : jsonValues) {
                PreparedStatement pstm = connection.prepareStatement("insert into ordersdetails values(?,?,?,?)");
                pstm.setObject(2, item.asJsonObject().getString("id"));
                pstm.setObject(3, item.asJsonObject().getString("qty"));
                pstm.setObject(4, item.asJsonObject().getString("up"));

                if (pstm.executeUpdate() > 0) {
                    resp.getWriter().print(addJSONObject("item Updated", "ok"));
                }

            }

        }catch (SQLException e){
            resp.setStatus(400);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));
        }catch (ClassNotFoundException e){
            resp.setStatus(500);
            resp.getWriter().print(addJSONObject(e.getMessage(), "error"));
        }

    }


    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private JsonObject addJSONObject(String message, String state) {

        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
        objectBuilder.add("state", state);
        objectBuilder.add("message", message);
        objectBuilder.add("data", "[]");


        return objectBuilder.build();
    }
}
