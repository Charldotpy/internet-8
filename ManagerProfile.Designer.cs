using Group_C_IOOP_Assignment;
using Manager;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Group_C_IOOP_Assignment
{
    public partial class LoginPage : Form
    {
        public LoginPage()
        {
            InitializeComponent();
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            string username = txtUsername.Text.Trim();
            string password = txtPassword.Text.Trim();

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                MessageBox.Show("Please enter both username and password.");
                return;
            }

            string connectionString = Properties.Settings.Default.DBConnection;

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT UserID, Role FROM Users WHERE Username = @Username AND Password = @Password";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string UserID = reader["UserID"].ToString();
                    string Role = reader["Role"].ToString();

                    reader.Close();

                    if (Role == "Manager")
                    {
                        ManagerHomePage managerHome = new ManagerHomePage(UserID);
                        managerHome.Show();
                        this.Hide();
                    }
                    else if (Role == "Customer")
                    {
                        
                    }
                    else
                    {
                        MessageBox.Show("Not recognized.");
                    }
                }
                else
                {
                    MessageBox.Show("Invalid login. Please try again.");
                }
            }
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void txtUsername_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
