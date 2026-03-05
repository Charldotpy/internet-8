namespace Group_C_IOOP_Assignment.Manager
{
    partial class ManagerRefund
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
            this.picSedapMakan = new System.Windows.Forms.PictureBox();
            this.lbRefund = new System.Windows.Forms.Label();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.btnLogOut = new System.Windows.Forms.Button();
            this.btnBack = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.btnSave = new System.Windows.Forms.Button();
            this.FeedbackID = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.OrderID = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.UserID = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Reason = new System.Windows.Forms.DataGridViewTextBoxColumn();
            ((System.ComponentModel.ISupportInitialize)(this.picSedapMakan)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.SuspendLayout();
            // 
            // picSedapMakan
            // 
            this.picSedapMakan.Image = global::Group_C_IOOP_Assignment.Properties.Resources.Sedap_Makan_logo;
            this.picSedapMakan.Location = new System.Drawing.Point(30, 27);
            this.picSedapMakan.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.picSedapMakan.Name = "picSedapMakan";
            this.picSedapMakan.Size = new System.Drawing.Size(157, 143);
            this.picSedapMakan.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picSedapMakan.TabIndex = 7;
            this.picSedapMakan.TabStop = false;
            // 
            // lbRefund
            // 
            this.lbRefund.AutoSize = true;
            this.lbRefund.BackColor = System.Drawing.Color.Transparent;
            this.lbRefund.Font = new System.Drawing.Font("Cooper Black", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lbRefund.Location = new System.Drawing.Point(550, 39);
            this.lbRefund.Name = "lbRefund";
            this.lbRefund.Size = new System.Drawing.Size(337, 91);
            this.lbRefund.TabIndex = 8;
            this.lbRefund.Text = "Refund";
            // 
            // dataGridView1
            // 
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.FeedbackID,
            this.OrderID,
            this.UserID,
            this.Reason});
            this.dataGridView1.Location = new System.Drawing.Point(276, 164);
            this.dataGridView1.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.RowHeadersWidth = 51;
            this.dataGridView1.RowTemplate.Height = 24;
            this.dataGridView1.Size = new System.Drawing.Size(899, 395);
            this.dataGridView1.TabIndex = 9;
            // 
            // btnLogOut
            // 
            this.btnLogOut.BackColor = System.Drawing.Color.White;
            this.btnLogOut.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnLogOut.Location = new System.Drawing.Point(30, 603);
            this.btnLogOut.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.btnLogOut.Name = "btnLogOut";
            this.btnLogOut.Size = new System.Drawing.Size(133, 52);
            this.btnLogOut.TabIndex = 10;
            this.btnLogOut.Text = "Log Out";
            this.btnLogOut.UseVisualStyleBackColor = false;
            this.btnLogOut.Click += new System.EventHandler(this.btnLogOut_Click);
            // 
            // btnBack
            // 
            this.btnBack.BackColor = System.Drawing.Color.White;
            this.btnBack.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnBack.Location = new System.Drawing.Point(206, 603);
            this.btnBack.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.btnBack.Name = "btnBack";
            this.btnBack.Size = new System.Drawing.Size(133, 52);
            this.btnBack.TabIndex = 11;
            this.btnBack.Text = "Back";
            this.btnBack.UseVisualStyleBackColor = false;
            this.btnBack.Click += new System.EventHandler(this.btnBack_Click);
            // 
            // btnExit
            // 
            this.btnExit.BackColor = System.Drawing.Color.White;
            this.btnExit.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnExit.Location = new System.Drawing.Point(1142, 603);
            this.btnExit.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(133, 52);
            this.btnExit.TabIndex = 12;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = false;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // btnSave
            // 
            this.btnSave.BackColor = System.Drawing.Color.DarkSeaGreen;
            this.btnSave.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSave.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSave.Location = new System.Drawing.Point(613, 584);
            this.btnSave.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(200, 71);
            this.btnSave.TabIndex = 39;
            this.btnSave.Text = "Save";
            this.btnSave.UseVisualStyleBackColor = false;
            // 
            // FeedbackID
            // 
            this.FeedbackID.DataPropertyName = "RefundID";
            this.FeedbackID.HeaderText = "RefundID";
            this.FeedbackID.MinimumWidth = 6;
            this.FeedbackID.Name = "FeedbackID";
            this.FeedbackID.ReadOnly = true;
            this.FeedbackID.Width = 125;
            // 
            // OrderID
            // 
            this.OrderID.DataPropertyName = "OrderID";
            this.OrderID.HeaderText = "OrderID";
            this.OrderID.MinimumWidth = 6;
            this.OrderID.Name = "OrderID";
            this.OrderID.ReadOnly = true;
            this.OrderID.Width = 125;
            // 
            // UserID
            // 
            this.UserID.DataPropertyName = "UserID";
            this.UserID.HeaderText = "UserID";
            this.UserID.MinimumWidth = 6;
            this.UserID.Name = "UserID";
            this.UserID.ReadOnly = true;
            this.UserID.Width = 125;
            // 
            // Reason
            // 
            this.Reason.DataPropertyName = "Reason";
            this.Reason.HeaderText = "Reason";
            this.Reason.MinimumWidth = 6;
            this.Reason.Name = "Reason";
            this.Reason.ReadOnly = true;
            this.Reason.Width = 300;
            // 
            // ManagerRefund
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::Group_C_IOOP_Assignment.Properties.Resources.image5;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(1313, 686);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.btnBack);
            this.Controls.Add(this.btnLogOut);
            this.Controls.Add(this.dataGridView1);
            this.Controls.Add(this.lbRefund);
            this.Controls.Add(this.picSedapMakan);
            this.DoubleBuffered = true;
            this.Name = "ManagerRefund";
            this.Text = "ManagerRefund";
            this.Load += new System.EventHandler(this.ManagerRefund_Load);
            ((System.ComponentModel.ISupportInitialize)(this.picSedapMakan)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox picSedapMakan;
        private System.Windows.Forms.Label lbRefund;
        private System.Windows.Forms.DataGridView dataGridView1;
        private System.Windows.Forms.Button btnLogOut;
        private System.Windows.Forms.Button btnBack;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.DataGridViewTextBoxColumn FeedbackID;
        private System.Windows.Forms.DataGridViewTextBoxColumn OrderID;
        private System.Windows.Forms.DataGridViewTextBoxColumn UserID;
        private System.Windows.Forms.DataGridViewTextBoxColumn Reason;
    }
}