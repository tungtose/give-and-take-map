# 1. Create vpc
resource "aws_vpc" "tungtodev" {
  cidr_block = "10.0.0.0/24"
  enable_dns_hostnames = true
  tags = {
    Name = "tungtodev"
  }
}

# 2. Create Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.tungtodev.id
}

# 3. Create Custom Route Table
resource "aws_route_table" "route_table_1" {
  vpc_id = aws_vpc.tungtodev.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "rt_1"
  }
}

resource "aws_route_table" "route_table_2" {
  vpc_id = aws_vpc.tungtodev.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "rt_2"
  }
}


# # 4. Create a Subnet 
resource "aws_subnet" "subnet_1" {
  vpc_id            = aws_vpc.tungtodev.id
  cidr_block        = "10.0.0.0/26"  # 62
  availability_zone = "ap_southeast_1b"

  tags = {
    Name = "public_subnet_1"
  }
}

resource "aws_subnet" "subnet_2" {
  vpc_id            = aws_vpc.tungtodev.id
  cidr_block        = "10.0.0.64/26"
  availability_zone = "ap_southeast_1c"

  tags = {
    Name = "public_subnet_2"
  }
}

# 5. Associate subnet with Route Table
resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.subnet_1.id
  route_table_id = aws_route_table.route_table_1.id
}

resource "aws_route_table_association" "c" {
  subnet_id      = aws_subnet.subnet_2.id
  route_table_id = aws_route_table.route_table_2.id
}


# 6. Create Security Group to allow port 22,80,443
resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow Web inbound traffic"
  vpc_id      = aws_vpc.tungtodev.id

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
   ingress {
    description = "api"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

   ingress {
    description = "web"
    from_port   = 8088
    to_port     = 8088
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "_1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_web"
  }
}

# 7. Create a network interface with an ip in the subnet that was created in step 4
resource "aws_network_interface" "web_server_ic_1" {
  subnet_id       = aws_subnet.subnet_1.id
  private_ips     = ["10.0.0.5"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_network_interface" "web_server_ic_2" {
  subnet_id       = aws_subnet.subnet_1.id
  private_ips     = ["10.0.0.6"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_network_interface" "web_server_qa" {
  subnet_id       = aws_subnet.subnet_1.id
  private_ips     = ["10.0.0.7"]
  security_groups = [aws_security_group.allow_web.id]
}


# 8. Assign an elastic IP to the network interface created in step 7
resource "aws_eip" "eip_1" {
  vpc                       = true
  network_interface         = aws_network_interface.web_server_ic_1.id
  associate_with_private_ip = "10.0.0.5"
  depends_on                = [aws_internet_gateway.gw]
}

resource "aws_eip" "eip_2" {
  vpc                       = true
  network_interface         = aws_network_interface.web_server_ic_2.id
  associate_with_private_ip = "10.0.0.6"
  depends_on                = [aws_internet_gateway.gw]
}

resource "aws_eip" "web_server_qa" {
  vpc                       = true
  network_interface         = aws_network_interface.web_server_qa.id
  associate_with_private_ip = "10.0.0.7"
  depends_on                = [aws_internet_gateway.gw]
}
