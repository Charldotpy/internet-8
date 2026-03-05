namespace Manager
{
    partial class ManagerHomePage
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.lblHome = new System.Windows.Forms.Label();
            this.lblManager = new System.Windows.Forms.Label();
            this.btnLogOut = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.btnFeedback = new System.Windows.Forms.Button();
            this.btnRefund = new System.Windows.Forms.Button();
            this.btnTopUp = new System.Windows.Forms.Button();
            this.btnUpdate = new System.Windows.Forms.Button();
            this.picSedapMakan = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.picSedapMakan)).BeginInit();
            this.SuspendLayout();
            // 
            // lblHome
            // 
            this.lblHome.AutoSize = true;
            this.lblHome.BackColor = System.Drawing.Color.Transparent;
            this.lblHome.Font = new System.Drawing.Font("Cooper Black", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblHome.Location = new System.Drawing.Point(490, 72);
            this.lblHome.Name = "lblHome";
            this.lblHome.Size = new System.Drawing.Size(478, 91);
            this.lblHome.TabIndex = 7;
            this.lblHome.Text = "Home Page";
            // 
            // lblManager
            // 
            this.lblManager.AutoSize = true;
            this.lblManager.BackColor = System.Drawing.Color.Transparent;
            this.lblManager.Font = new System.Drawing.Font("Cooper Black", 28.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblManager.Location = new System.Drawing.Point(616, 169);
            this.lblManager.Name = "lblManager";
            this.lblManager.Size = new System.Drawing.Size(228, 54);
            this.lblManager.TabIndex = 8;
            this.lblManager.Text = "Manager";
            // 
            // btnLogOut
            // 
            this.btnLogOut.BackColor = System.Drawing.Color.White;
            this.btnLogOut.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnLogOut.Location = new System.Drawing.Point(29, 599);
            this.btnLogOut.Name = "btnLogOut";
            this.btnLogOut.Size = new System.Drawing.Size(133, 52);
            this.btnLogOut.TabIndex = 9;
            this.btnLogOut.Text = "Log Out";
            this.btnLogOut.UseVisualStyleBackColor = false;
            this.btnLogOut.Click += new System.EventHandler(this.btnLogOut_Click);
            // 
            // btnExit
            // 
            this.btnExit.BackColor = System.Drawing.Color.WhiteSmoke;
            this.btnExit.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnExit.Location = new System.Drawing.Point(1153, 599);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(133, 52);
            this.btnExit.TabIndex = 10;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = false;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // btnFeedback
            // 
            this.btnFeedback.BackColor = System.Drawing.Color.White;
            this.btnFeedback.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnFeedback.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnFeedback.Location = new System.Drawing.Point(361, 284);
            this.btnFeedback.Name = "btnFeedback";
            this.btnFeedback.Size = new System.Drawing.Size(210, 101);
            this.btnFeedback.TabIndex = 12;
            this.btnFeedback.Text = "View and Respond Feedback";
            this.btnFeedback.UseVisualStyleBackColor = false;
            this.btnFeedback.Click += new System.EventHandler(this.btnFeedback_Click);
            // 
            // btnRefund
            // 
            this.btnRefund.BackColor = System.Drawing.Color.White;
            this.btnRefund.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnRefund.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnRefund.Location = new System.Drawing.Point(813, 284);
            this.btnRefund.Name = "btnRefund";
            this.btnRefund.Size = new System.Drawing.Size(210, 101);
            this.btnRefund.TabIndex = 13;
            this.btnRefund.Text = "Customer Refund Approval";
            this.btnRefund.UseVisualStyleBackColor = false;
            this.btnRefund.Click += new System.EventHandler(this.btnRefund_Click);
            // 
            // btnTopUp
            // 
            this.btnTopUp.BackColor = System.Drawing.Color.White;
            this.btnTopUp.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnTopUp.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnTopUp.Location = new System.Drawing.Point(361, 455);
            this.btnTopUp.Name = "btnTopUp";
            this.btnTopUp.Size = new System.Drawing.Size(210, 101);
            this.btnTopUp.TabIndex = 14;
            this.btnTopUp.Text = "Top-up e-wallet";
            this.btnTopUp.UseVisualStyleBackColor = false;
            this.btnTopUp.Click += new System.EventHandler(this.btnTopUp_Click);
            // 
            // btnUpdate
            // 
            this.btnUpdate.BackColor = System.Drawing.Color.White;
            this.btnUpdate.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnUpdate.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnUpdate.Location = new System.Drawing.Point(813, 455);
            this.btnUpdate.Name = "btnUpdate";
            this.btnUpdate.Size = new System.Drawing.Size(210, 101);
            this.btnUpdate.TabIndex = 15;
            this.btnUpdate.Text = "Update Profile";
            this.btnUpdate.UseVisualStyleBackColor = false;
            this.btnUpdate.Click += new System.EventHandler(this.btnUpdate_Click);
            // 
            // picSedapMakan
            // 
            this.picSedapMakan.Image = global::Group_C_IOOP_Assignment.Properties.Resources.Sedap_Makan_logo;
            this.picSedapMakan.Location = new System.Drawing.Point(29, 20);
            this.picSedapMakan.Name = "picSedapMakan";
            this.picSedapMakan.Size = new System.Drawing.Size(157, 143);
            this.picSedapMakan.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picSedapMakan.TabIndex = 16;
            this.picSedapMakan.TabStop = false;
            // 
            // ManagerHomePage
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.MistyRose;
            this.BackgroundImage = global::Group_C_IOOP_Assignment.Properties.Resources.image7;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(1313, 686);
            this.Controls.Add(this.picSedapMakan);
            this.Controls.Add(this.btnUpdate);
            this.Controls.Add(this.btnTopUp);
            this.Controls.Add(this.btnRefund);
            this.Controls.Add(this.btnFeedback);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.btnLogOut);
            this.Controls.Add(this.lblManager);
            this.Controls.Add(this.lblHome);
            this.DoubleBuffered = true;
            this.Name = "ManagerHomePage";
            this.Text = "ManagerHomePage";
            this.Load += new System.EventHandler(this.ManagerHomePage_Load);
            ((System.ComponentModel.ISupportInitialize)(this.picSedapMakan)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Label lblHome;
        private System.Windows.Forms.Label lblManager;
        private System.Windows.Forms.Button btnLogOut;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Button btnFeedback;
        private System.Windows.Forms.Button btnRefund;
        private System.Windows.Forms.Button btnTopUp;
        private System.Windows.Forms.Button btnUpdate;
        private System.Windows.Forms.PictureBox picSedapMakan;
    }
}