package communication;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.Date;


public class Server{
	    public static void main(String arg[]) throws Exception {
	    DatagramSocket serversocket = new DatagramSocket(9999);
	    Server udpserver = new Server();
	    byte[] receivedBuffer; // = new byte[1024];
	    byte[] sentBuffer; //= new byte[1024];
	    while (true) {
	        receivedBuffer = new byte[1024];
	        sentBuffer = new byte[1024];
	        DatagramPacket receivedpacket = new DatagramPacket(receivedBuffer, receivedBuffer.length);
	        System.out.println("Server Waiting for a message from Client.....");
	
	        serversocket.receive(receivedpacket);
	        String fromClient = new String(receivedpacket.getData());
	        // enter td command to display the curerct date and time
	        if (fromClient != null && fromClient.startsWith("td")) {
	            InetAddress clientIP = receivedpacket.getAddress();
	            System.out.println("Message received from client : " + fromClient + " at IP Address = "
	                    + clientIP.getHostAddress() + ", Host Name = " + clientIP.getHostName());
	
	            String toClient = udpserver.dateAndTime();
	            sentBuffer = toClient.getBytes();
	            DatagramPacket sendpacket = new DatagramPacket(sentBuffer, sentBuffer.length, clientIP, 8888);
	            serversocket.send(sendpacket);
	            System.out.println(" Reply Message is sent to client " + clientIP.getHostAddress());
	        }
	
	        // converting the TEMPERATURE into Farenheit
	        if (fromClient != null && fromClient.startsWith("TEMP") && !fromClient.startsWith("td")) {
	
	            InetAddress clientIP = receivedpacket.getAddress();
	            System.out.println("Message received from client : " + fromClient + " at IP Address = "
	                    + clientIP.getHostAddress() + ", Host Name = " + clientIP.getHostName());
	            float temp = Float.parseFloat(fromClient.substring(fromClient.indexOf(' ') + 1));
	            float tempInFaren = (float) (temp * 1.8 + 32.0);
	            //float toClient = tempInFaren ;
	            String convertIntoFarenheit = String.valueOf(tempInFaren);
	
	            sentBuffer = convertIntoFarenheit.getBytes();
	            DatagramPacket sendpacket = new DatagramPacket(sentBuffer, sentBuffer.length, clientIP, 8888);
	            serversocket.send(sendpacket);
	            System.out.println(" Reply Message is sent to client " + clientIP.getHostAddress());
	
	        }
	        try {
	            Thread.sleep(2000);
	        } catch (InterruptedException ie) {
	        }
	    }
	}
	
	//method for returning current date and time
	public String dateAndTime() {
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    Date d = new Date();
	    String s = sdf.format(d);
	
	    return s;
	
	}
}