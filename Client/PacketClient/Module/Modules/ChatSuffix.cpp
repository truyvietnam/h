#include "ChatSuffix.h"

#include "../../../Utils/Utils.h"
ChatSuffix::ChatSuffix() : IModule(0, Category::MISC, "Adds the client suffix") {
}

ChatSuffix::~ChatSuffix() {
}

const char* ChatSuffix::getModuleName() {
	return "ChatSuffix";
}

void ChatSuffix::onSendPacket(C_Packet* packet) {
	if (packet->isInstanceOf<C_TextPacket>()) {
		C_TextPacket* funy = reinterpret_cast<C_TextPacket*>(packet);
		std::string Sentence;
		std::string start;
		std::string end;
		start = "> ";
		end = " | Orion Fusion on top! | " + Utils::randomString(8);
		Sentence = start + funy->message.getText() + end;
		funy->message.resetWithoutDelete();
		funy->message = Sentence;
	}
}