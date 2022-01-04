resource "aws_key_pair" "deployer" {
  key_name   = "deployer_key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINTzj1VYy9FATDIKRaiRV5YtB1P9qD6GlMph5Vxeneqe tung-mac-2"
}

resource "aws_instance" "map_server" {
  ami           = var.image_id
  instance_type = "t2.micro"
  key_name      = "deployer_key"
  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.web_server_ic_1.id
  }
  user_data = file(var.script_path)
  iam_instance_profile = aws_iam_instance_profile.profile.name
  tags = {
    Name = "map_server"
    Environment = "dev"
  }
}


resource "aws_iam_instance_profile" "profile" {
  name = "${local.env}_map_server_profile"
  role = aws_iam_role.ec2_role.name
}
