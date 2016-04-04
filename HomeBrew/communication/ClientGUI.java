package communication;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JButton;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import javax.swing.JTextPane;
import javax.swing.JLabel;

public class ClientGUI extends JFrame {

	private JPanel contentPane;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					ClientGUI frame = new ClientGUI();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public ClientGUI() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JButton btnUpdateGraph = new JButton("Update Graph");
		btnUpdateGraph.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
			}
		});
		btnUpdateGraph.setBounds(10, 227, 127, 23);
		contentPane.add(btnUpdateGraph);
		
		JTextPane txtpnGraphTemplate = new JTextPane();
		txtpnGraphTemplate.setText("Graph Template");
		txtpnGraphTemplate.setBounds(46, 36, 378, 155);
		contentPane.add(txtpnGraphTemplate);
		
		JLabel lblTempuratureStatus = new JLabel("Temperature Status: -------");
		lblTempuratureStatus.setBounds(10, 11, 154, 14);
		contentPane.add(lblTempuratureStatus);
		
		JLabel lblNewLabel = new JLabel("X");
		lblNewLabel.setBounds(46, 202, 13, 14);
		contentPane.add(lblNewLabel);
		
		JLabel lblNewLabel_1 = new JLabel("Y");
		lblNewLabel_1.setBounds(17, 177, 19, 14);
		contentPane.add(lblNewLabel_1);
	}
}
