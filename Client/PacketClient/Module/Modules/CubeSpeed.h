#include "Module.h"

class CubeSpeed : public IModule {
private:
	int delay = 0.1;
	int delay2 = 0.2;
	bool isBypass = false;
	float speedMod = 0.79f;

public:
	virtual void onMove(C_MoveInputHandler* input) override;
	C_MovePlayerPacket* jetpack = nullptr;
	CubeSpeed();
	~CubeSpeed();


	// Inherited via IModule
	virtual const char* getModuleName() override;
};
