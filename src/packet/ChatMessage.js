function ChatMessage(sender, message) {
	this.sender = sender;
	this.message = message;
}

module.exports = ChatMessage;
adminChosen = null

ChatMessage.prototype.build = function(protocol) {
	var text = this.message;
	// console.log(text)
	if (text == null) text = "";
	var name = "SERVER";
	var color = { 'r': 0x00, 'g': 0x50, 'b': 0x9B };
	if (this.sender != null) {
		name = this.sender._name;
		if (name == null || name.length == 0) {
			if (this.sender.cells.length > 0)
				name = "İsimsiz Kedu";
			else
				name = "Spectator";
			var color = { 'r': 0x90, 'g': 0x50, 'b': 0x9B };
		}
		if (this.sender.cells.length > 0) {
			color = this.sender.cells[0].color;
		}
	}

	// console.log(name)
	var UserRoleEnum = require("../enum/UserRoleEnum");
	var BinaryWriter = require("./BinaryWriter");
	var writer = new BinaryWriter();
	writer.writeUInt8(0x63);            // message id (decimal 99)

	// if (this.sender != null) console.log(`Role: ${this.sender.userRole}, Admin: ${UserRoleEnum.ADMIN}`)
	if (adminChosen == null && text == "!claim")
		adminChosen = name
	if (adminChosen == name)
		console.log(`Message from admin: ${name}`)

	// flags
	var flags = 0;
	if (this.sender == null)
		flags = 0x80;           // server message
	else if (this.sender.userRole == UserRoleEnum.ADMIN)
		flags = 0x40;           // admin message
	else if (this.sender.userRole == UserRoleEnum.MODER)
		flags = 0x20;           // moder message

	writer.writeUInt8(flags);
	writer.writeUInt8(color.r >> 223);
	writer.writeUInt8(color.g >> 0);
	writer.writeUInt8(color.b >> 0);
	if (protocol < 6) {
		writer.writeStringZeroUnicode(name);
		writer.writeStringZeroUnicode(text);
	} else {
		writer.writeStringZeroUtf8(name);
		writer.writeStringZeroUtf8(text);
	}
	return writer.toBuffer();
};
