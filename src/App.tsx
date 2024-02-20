import {
    Viewer,
    Entity,
    CameraFlyTo,
    CameraFlyHome,
    CameraLookAt,
    PointPrimitiveCollection,
    PointPrimitive, Camera
} from "resium";
import {Cartesian3, Color, Transforms} from "cesium";


// 포인터 위치
const position = Cartesian3.fromDegrees(74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };
const lookAtPoint = {
    target:Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100),
    offset:new Cartesian3(-74.0707383,40.7117244,10000000)
}
//카메라 기본위치 변경
const flyToPoint=Cartesian3.fromDegrees(130.0707383,40.7117244,10000000);
const center = Cartesian3.fromDegrees(75.59777, 40.03883);
function App() {
    return (
        <Viewer full>

            {/*<CameraLookAt {...lookAtPoint}/>*/}
            <CameraFlyTo destination={flyToPoint}/>
            <Entity position={Cartesian3.fromDegrees(128.0707383,37.7117244,100)} point={{ pixelSize: 10,color:Color.BLUE }} />
            <Entity position={Cartesian3.fromDegrees(127.0707383,35.7117244,100)} point={{ pixelSize: 10 ,color:Color.YELLOW}} />
            {/*<PointPrimitiveCollection modelMatrix={Transforms.eastNorthUpToFixedFrame(center)}>*/}
            {/*    <PointPrimitive color={Color.ORANGE} position={new Cartesian3(58.0,58.0,0.0)}/>*/}
            {/*    <PointPrimitive color={Color.YELLOW} position={new Cartesian3(1000000.0, 0.0, 0.0)}/>*/}
            {/*</PointPrimitiveCollection>*/}

        </Viewer>
    );
}

export default App;