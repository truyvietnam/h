#include "../../Module/ModuleManager.h"
#include "Flight.h"
#include <cmath>
uintptr_t ViewBobbing = FindSignature("0F B6 80 DB 01 00 00");

Flight::Flight() : IModule(0, Category::MOVEMENT, "Fly wow!") {
	registerEnumSetting("Mode", &mode, 0);
	mode.addEntry("Vanilla", 0);
	mode.addEntry("Airwalk", 1);
	//mode.addEntry("Teleport", 2); // removed for now ig
	mode.addEntry("Jetpack", 3);
	mode.addEntry("Hive", 4);
	mode.addEntry("Jetpack2", 5);
	mode.addEntry("Motion", 6);
	mode.addEntry("Moonlight", 7);
	mode.addEntry("Geyser", 8);
	registerBoolSetting("ViewBobbing", &viewBobbing, viewBobbing);
	registerBoolSetting("Damage", &damage, damage);
	registerBoolSetting("Boost", &boost, boost);
	registerFloatSetting("Speed", &speed, speed, 0.2f, 5.f);
	registerFloatSetting("value", &value, value, -0.15f, 0.00);
	registerFloatSetting("Horizontal Speed", &this->horizontalSpeed, this->horizontalSpeed, 0.1f, 10.f);
	registerFloatSetting("Vertical Speed", &this->verticalSpeed, this->verticalSpeed, 0.1f, 10.f);
}

Flight::~Flight() {
}

const char* Flight::getRawModuleName() {
	return "Flight";
}

const char* Flight::getModuleName() {
	if (mode.getSelectedValue() == 0) name = std::string("Flight ") + std::string(GRAY) + std::string("Vanilla");
	if (mode.getSelectedValue() == 1) name = std::string("Flight ") + std::string(GRAY) + std::string("Airwalk");
	//if (mode.getSelectedValue() == 2) name = std::string("Flight ") + std::string(GRAY) + std::string("Teleport");
	if (mode.getSelectedValue() == 3) name = std::string("Flight ") + std::string(GRAY) + std::string("Jetpack");
	if (mode.getSelectedValue() == 4) name = std::string("Flight ") + std::string(GRAY) + std::string("Hive");
	return name.c_str();
}

void Flight::onEnable() {
	auto speed = moduleMgr->getModule<Speed>();
	if (speed->isEnabled()) speedWasEnabled = true;
	auto player = g_Data.getLocalPlayer();
	if (player == nullptr) return;

	PointingStruct* pointing = g_Data.getLocalPlayer()->pointingStruct;
	if (damage) {
		pointing->playSound("game.player.hurt", *player->getPos(), 1, 1);
		player->animateHurt();
	}
	if (mode.getSelectedValue() == 6) {
		if (Game.getLocalPlayer() != nullptr)
		Game.getLocalPlayer()->setPos((*Game.getLocalPlayer()->getPos()).add(Vec3(0, 1, 0)));
	}
}

bool Flight::isFlashMode() {
	return mode.getSelectedValue() == 3;
}

void Flight::onTick(C_GameMode* gm) {
	if (viewBobbing) {
		Utils::patchBytes((unsigned char*)ViewBobbing, (unsigned char*)"\xB8\x01\x00\x00\x00\x90\x90", 7);
		if (value >= 0.00)
			value = -0.0000000001; // just dw about it lol
	}
	else Utils::patchBytes((unsigned char*)ViewBobbing, (unsigned char*)"\x0F\xB6\x80\xDB\x01\x00\x00", 7);
	auto player = g_Data.getLocalPlayer();
	if (player == nullptr) return;

	C_GameSettingsInput* input = g_Data.getClientInstance()->getGameSettingsInput();
	g_Data.getClientInstance()->getMoveTurnInput()->isSneakDown = false;
	auto speedMod = moduleMgr->getModule<Speed>();
	if (speedMod->isEnabled()) {
		auto notification = g_Data.addNotification("Flight:", "Disabled Speed to prevent flags/errors");
		notification->duration = 5;
		speedMod->setEnabled(false);
	}

	// Math
	float yaw = player->yaw;
	float calcYaw = (gm->player->yaw + 90) * (PI / 180);
	float calcPitch = (gm->player->pitch) * -(PI / 180);
	vec3_t moveVec;
	moveVec.x = cos(calcYaw) * cos(calcPitch) * speed;
	moveVec.y = sin(calcPitch) * speed;
	moveVec.z = sin(calcYaw) * cos(calcPitch) * speed;

	// Vanilla
	if (mode.getSelectedValue() == 0) { 
		if (g_Data.canUseMoveKeys()) {
			if (GameData::isKeyDown(*input->spaceBarKey))
				effectiveValue += speed;
			if (GameData::isKeyDown(*input->sneakKey))
				effectiveValue -= speed;
		}
		if (input->forwardKey && input->backKey && input->rightKey && input->leftKey) {
			gm->player->velocity = vec3_t(0, 0, 0);
		}
		gm->player->velocity.y = effectiveValue;
		effectiveValue = value;
	}

	// Airwalk
	if (mode.getSelectedValue() == 1) {
		if (speedMod->isEnabled() || GameData::isKeyDown(*input->spaceBarKey)) 
			player->onGround = false;
		else 
			player->onGround = true;
		gm->player->velocity.y = effectiveValue;
		effectiveValue = value;
	}

	// Jetpack
	if (mode.getSelectedValue() == 3) gm->player->lerpMotion(moveVec);
	if (mode.getSelectedValue() == 7) gm->player->velocity = Vec3(0, 0, 0);
	if (mode.getSelectedValue()==5) {
		if (gameTick >= 5) {
			float calcYaw = (gm->player->yaw + 90) * (PI / 180);
			float calcPitch = (gm->player->pitch) * -(PI / 180);

			Vec3 pos = *Game.getLocalPlayer()->getPos();
			C_MovePlayerPacket a(Game.getLocalPlayer(), pos);
			Game.getClientInstance()->loopbackPacketSender->sendToServer(&a);
			pos.y += 0.35f;
			a = C_MovePlayerPacket(Game.getLocalPlayer(), pos);
			Game.getClientInstance()->loopbackPacketSender->sendToServer(&a);

			gm->player->velocity.y = 0.465f;
			Vec3 moveVec;
			moveVec.x = cos(calcYaw) * cos(calcPitch) * horizontalSpeed;
			moveVec.z = sin(calcYaw) * cos(calcPitch) * horizontalSpeed;

			gm->player->velocity.x = moveVec.x;
			gm->player->velocity.z = moveVec.z;

			float teleportX = cos(calcYaw) * cos(calcPitch) * 0.00000005f;
			float teleportZ = sin(calcYaw) * cos(calcPitch) * 0.00000005f;

			pos = *gm->player->getPos();
			Game.getLocalPlayer()->setPos(Vec3(pos.x + teleportX, pos.y - 0.15f, pos.z + teleportZ));

			gm->player->velocity.y -= 0.15f;
			gameTick = 0;
		}

		gm->player->velocity = Vec3(0, 0, 0);

	}
}

void Flight::onMove(C_MoveInputHandler* input) {
	auto player = g_Data.getLocalPlayer();
	if (player == nullptr) return;

	bool keyPressed = false;
	GameSettingsInput *inputf = Game.getClientInstance()->getGameSettingsInput();
	bool jumping = GameData::isKeyDown(*inputf->spaceBarKey);
	bool sneaking = GameData::isKeyDown(*inputf->sneakKey);

	// meth
	vec2_t moveVec2d = { input->forwardMovement, -input->sideMovement };
	bool pressed = moveVec2d.magnitude() > 0.01f;

	float calcYaw = (player->yaw + 90) * (PI / 180);
	vec3_t moveVec;
	float c = cos(calcYaw);
	float s = sin(calcYaw);
	moveVec2d = { moveVec2d.x * c - moveVec2d.y * s, moveVec2d.x * s + moveVec2d.y * c };

	// Vanilla
	if (mode.getSelectedValue() == 0) {
		moveVec.x = moveVec2d.x * speed;
		moveVec.y = player->velocity.y;
		moveVec.z = moveVec2d.y * speed;
		if (pressed) player->lerpMotion(moveVec);
	}
	if (mode,getSelectedValue()==7) {
			// Moonlight is an AntiCheat by disepi (Zephyr Developer)
		// This Fly/Glide worked on the Hive in the first half year of 2021
		// Idea from Weather Client (dead by now), TurakanFly from BadMan worked similar with less height loss

		if (localPlayer->onGround == false) {
			localPlayer->velocity.y = 0;
		}

		GameSettingsInput *input = Game.getClientInstance()->getGameSettingsInput();

		if (input == nullptr)
			return;

		float yaw = localPlayer->yaw;

		if (GameData::isKeyDown(*input->forwardKey) && GameData::isKeyDown(*input->backKey))
			return;
		else if (GameData::isKeyDown(*input->forwardKey) && GameData::isKeyDown(*input->rightKey) && !GameData::isKeyDown(*input->leftKey)) {
			yaw += 45.f;
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->forwardKey) && GameData::isKeyDown(*input->leftKey) && !GameData::isKeyDown(*input->rightKey)) {
			yaw -= 45.f;
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->backKey) && GameData::isKeyDown(*input->rightKey) && !GameData::isKeyDown(*input->leftKey)) {
			yaw += 135.f;
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->backKey) && GameData::isKeyDown(*input->leftKey) && !GameData::isKeyDown(*input->rightKey)) {
			yaw -= 135.f;
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->forwardKey)) {
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->backKey)) {
			yaw += 180.f;
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->rightKey) && !GameData::isKeyDown(*input->leftKey)) {
			yaw += 90.f;
			keyPressed = true;
		} else if (GameData::isKeyDown(*input->leftKey) && !GameData::isKeyDown(*input->rightKey)) {
			yaw -= 90.f;
			keyPressed = true;
		} else {
			localPlayer->velocity.x = 0.f;
			localPlayer->velocity.z = 0.f;
			keyPressed = false;
		}

		if (yaw >= 180)
			yaw -= 360.f;

		float calcYaw = (yaw + 90) * (PI / 180);
		Vec3 moveVec;
		moveVec.x = cos(calcYaw) * horizontalSpeed;
		moveVec.y = localPlayer->velocity.y;
		moveVec.z = sin(calcYaw) * horizontalSpeed;

		if (keyPressed) {
			localPlayer->lerpMotion(moveVec);
			keyPressed = false;
		}

		if (gameTick > 6) {
			if (localPlayer->onGround == false) {
				Vec3 pos;
				pos.x = localPlayer->getPos()->x;
				pos.y = localPlayer->getPos()->y - 0.025f;
				pos.z = localPlayer->getPos()->z;

				localPlayer->setPos(pos);
			}

			gameTick = 0;
		}
	}
	if (mode.getSelectedValue()==6) {
		Vec3 *localPlayerPos = localPlayer->getPos();

		float yaw = localPlayer->yaw;
		Vec2 moveVec2d = {input->forwardMovement, -input->sideMovement};
		bool pressed = moveVec2d.magnitude() > 0.01f;

		if (input->isJumping) {
			localPlayer->velocity.y += verticalSpeed;
			localPlayer->fallDistance = 0.f;
		}

		if (input->isSneakDown) {
			localPlayer->velocity.y -= verticalSpeed;
			localPlayer->fallDistance = 0.f;
		}

		if (input->right) {
			yaw += 90.f;

			if (input->forward)
				yaw -= 45.f;
			else if (input->backward)
				yaw += 45.f;
		}

		if (input->left) {
			yaw -= 90.f;

			if (input->forward)
				yaw += 45.f;
			else if (input->backward)
				yaw -= 45.f;
		}

		if (input->backward && !input->left && !input->right)
			yaw += 180.f;

		if (pressed) {
			float calcYaw = (yaw + 90.f) * (PI / 180.f);
			Vec3 moveVec;
			moveVec.x = cos(calcYaw) * horizontalSpeed;
			moveVec.y = localPlayer->velocity.y;
			moveVec.z = sin(calcYaw) * horizontalSpeed;
			localPlayer->lerpMotion(moveVec);
		}
	}
	if (mode.getSelectedValue()==8){
		float motion = 0.0f;

		if (Game.canUseMoveKeys()) {
			if (jumping)
				motion += verticalSpeed;
			if (sneaking)
				motion -= verticalSpeed;
		}

		if (gameTick = 15 && !jumping && !sneaking) {
			motion = -0.04;
			gameTick = 0;
		}

		if (flag || jumping || sneaking) {
			moveVec.x = moveVec2D.x * horizontalSpeed;
			moveVec.y = motion;
			moveVec.z = moveVec2D.y * horizontalSpeed;

			localPlayer->lerpMotion(moveVec);
		}
	}
}

void Flight::onSendPacket(C_Packet* packet) {
}


void Flight::onDisable() {
	Utils::patchBytes((unsigned char*)ViewBobbing, (unsigned char*)"\x0F\xB6\x80\xDB\x01\x00\x00", 7);
	auto player = g_Data.getLocalPlayer();
	if (player == nullptr) return;

	if (viewBobbing) player->onGround = false;
	auto speed = moduleMgr->getModule<Speed>();
	if (speedWasEnabled) {
		speed->setEnabled(true);
		speedWasEnabled = false;
	}
	player->velocity = vec3_t(0, 0, 0);
}