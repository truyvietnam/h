#include "2b2eFly.h"
#include <chrono>

FlyBypass::FlyBypass() : IModule(70, Category::MOVEMENT, "You can fly in 2B2E By Kaeru") {
    enabledTicks = 0;
}

FlyBypass::~FlyBypass() {
}

const char* FlyBypass::getModuleName() {
    return "2B2E-Fly";
}

void FlyBypass::onEnable() {
    auto player = g_Data.getLocalPlayer();
    player->animateHurt();
    enabledTicks = 0;
}

void FlyBypass::onTick(C_GameMode* gm) {
    glideModEffective = glideMod;
    C_GameSettingsInput* input = g_Data.getClientInstance()->getGameSettingsInput();

    if (g_Data.canUseMoveKeys()) {
        if (GameData::isKeyDown(*input->spaceBarKey))
            glideModEffective += 0.0f;
        if (GameData::isKeyDown(*input->sneakKey))
            glideModEffective -= 0.0f;
    }
    gm->player->velocity.y = glideModEffective;
    if (!gm->player->isSprinting() && gm->player->velocity.magnitudexz() > 0.01f) {
        C_GameSettingsInput* input = g_Data.getClientInstance()->getGameSettingsInput();
        gm->player->setSprinting(true);
    }

    // Increase the enabled ticks
    enabledTicks += 1;

    // Check if the enabled ticks have exceeded the desired duration (10 ticks = 0.5 seconds)
    if (enabledTicks > 40) {
        this->setEnabled(false);
    }
}

void FlyBypass::onMove(C_MoveInputHandler* input) {
    auto player = g_Data.getLocalPlayer();
    if (player == nullptr) return;

    if (player->isInLava() == 1 || player->isInWater() == 1)
        return;

    if (player->isSneaking())
        return;

    float yaw = player->yaw;

    bool pressed = input->forward || input->backward || input->right || input->left;

    if (input->forward && input->backward)
        return;

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

    float calcYaw = (yaw + 90) * (PI / 180);
    vec3_t moveVec;
    moveVec.x = cos(calcYaw) * 0.20;
    moveVec.y = player->velocity.y;
    moveVec.z = sin(calcYaw) * 0.20;
    if (pressed) player->lerpMotion(moveVec);
}

void FlyBypass::onDisable() {
}
