package communication;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Arrays;



public class Client{
	public static void main(String args[]) throws Exception {
	    byte[] sendData;
	    byte[] receiveData;
	    BufferedReader inFromKeyboard = new BufferedReader(new InputStreamReader(System.in));
	    try {
	        DatagramSocket clientSocket = new DatagramSocket(8888);
	        InetAddress IPAddress = InetAddress.getByName("localhost");
	        while (true) {
	        	
	        	
	        	
	        	 /*********************************
	              create a new buffer each time */
	                sendData = new byte[1024];
	                receiveData = new byte[1024];
	             /*********************************/
	                Arrays.fill( receiveData, (byte) 0 );
		        	Arrays.fill( sendData, (byte) 0 );
	            System.out.println("Please enter the message to send to server: ");
	            String sentence = inFromKeyboard.readLine();
	            //sending time and date command
	            if (sentence.startsWith("td") && !sentence.startsWith("TEMP")) {
	                sendData = sentence.getBytes();
	                DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, 9999);
	                clientSocket.send(sendPacket);
	
	                DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
	                System.out.println(
	                        "Message Sent to Server : " + sentence + "\n Now waiting for reply from Server....");
	                clientSocket.receive(receivePacket);
	                String fromServer = new String(receivePacket.getData());
	                System.out.println("Message Returned from Server : " + fromServer);
	
	            }
	            //sending TEMP command
	
	            if (sentence.startsWith("TEMP") && !sentence.startsWith("td")) {
	                sendData = sentence.getBytes();
	                DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, 9999);
	                clientSocket.send(sendPacket);
	
	                DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
	                System.out.println(
	                        "Message Sent to Server : " + sentence + "\n Now waiting for reply from Server....");
	                clientSocket.receive(receivePacket);
	                String fromServer = new String(receivePacket.getData());
	                System.out.println("Message Returned from Server : " + fromServer);
	
	            }
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
}