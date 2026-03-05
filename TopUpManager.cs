using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Group_C_IOOP_Assignment;
using Manager;


namespace Group_C_IOOP_Assignment.Manager
{
    public partial class ManagerTopUpUsername : Form
    {
        public ManagerTopUpUsername()
        {
            InitializeComponent();
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {
            string UserID = txtUserID.Text.Trim();

            if (string.IsNullOrEmpty(UserID))
            {
                MessageBox.Show("Please enter an UserID.");
                return;
            }

            string WalletID = GetWalletIDByUserID(UserID);

            if (!string.IsNullOrEmpty(WalletID))
            {
                this.Hide(); 
                ManagerTopUp TopUpForm = new ManagerTopUp(WalletID);
                TopUpForm.ShowDialog();
                this.Show();
            }
            else
            {
                MessageBox.Show("Not found for the entered UserID.");
            }
        }

        private string GetWalletIDByUserID(string UserID)
        {
            string connectionString = Properties.Settings.Default.DBConnection;
            string WalletID = "";

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT WalletID FROM Wallets WHERE UserID = @UserID";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@UserID", UserID);
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    WalletID = reader["WalletID"].ToString();
                }
                reader.Close();
            }

            return WalletID;
        }

        private void btnLogOut_Click(object sender, EventArgs e)
        {
            Group_C_IOOP_Assignment.LoginPage LoginPage = new Group_C_IOOP_Assignment.LoginPage();
            LoginPage.Show();
            this.Hide();
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            ManagerHomePage HomePage = new ManagerHomePage();
            HomePage.Show();
            this.Hide();
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
