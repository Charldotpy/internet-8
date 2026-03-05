using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Group_C_IOOP_Assignment.Manager
{
    public partial class ManagerTopUp : Form
    {
        private string currentWalletID;
        private TopUpManager topUpManager = new TopUpManager();

        public ManagerTopUp(string walletID)
        {
            InitializeComponent();
            currentWalletID = walletID;
        }

        private void ManagerTopUp_Load(object sender, EventArgs e)
        {
            decimal balance = topUpManager.GetCurrentBalance(currentWalletID);
            lblRM.Text = "RM " + balance.ToString("0.00");
        }

        private void btnTopUp_Click(object sender, EventArgs e)
        {
            if (decimal.TryParse(txtTopUp.Text, out decimal topUpAmount) && topUpAmount > 0)
            {
                bool success = topUpManager.TopUpWallet(currentWalletID, topUpAmount);
                if (success)
                {
                    MessageBox.Show("Successfuly Top Up!");
                    lblRM.Text = "RM " + topUpManager.GetCurrentBalance(currentWalletID).ToString("0.00");
                }
                else
                {
                    MessageBox.Show("Top Up failed. Please try again!");
                }
            }
            else
            {
                MessageBox.Show("Please enter a valid amount.");
            }
        }

        private void btnLogOut_Click(object sender, EventArgs e)
        {
            Group_C_IOOP_Assignment.LoginPage LoginPage = new Group_C_IOOP_Assignment.LoginPage();
            LoginPage.Show();
            this.Hide();
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            ManagerTopUpUsername TopUpUsername = new ManagerTopUpUsername();
            TopUpUsername.Show();
            this.Hide();
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
