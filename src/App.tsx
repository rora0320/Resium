import {
    Viewer,
    Entity,
    CameraFlyTo,
    CameraFlyHome,
    CameraLookAt,
    PointPrimitiveCollection,
    PointPrimitive, Camera, CorridorGraphics, CylinderGraphics, CesiumComponentRef, Scene, Model,
} from "resium";

import * as Cesium from "cesium";
import {
    eastNorthUpToFixedFrame, Matrix3, Matrix4,
    northEastDownToFixedFrame,
    northUpEastToFixedFrame, northWestUpToFixedFrame,
    Transforms,
    Viewer as CesiumViewer
} from "cesium";
import {Cartesian3, Color, CornerType,Cartographic} from "cesium";
import {useEffect, useRef, useState} from "react";

// 포인터 위치
const position = Cartesian3.fromDegrees(74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };
//카메라를 지구본의 특정 위치로 고정
const lookAtPoint = {
    target:Cartesian3.fromDegrees(127.0707383, 35.7117244, 100),
    offset:new Cartesian3(-74.0707383,40.7117244,10000000)
}
//카메라 날아가서 위치 변경
const flyToPoint=Cartesian3.fromDegrees(130.0707383,40.7117244,10000000);
const center = Cartesian3.fromDegrees(125.59777, 40.03883);


//model 위치 가져온것
const origin = Cartesian3.fromDegrees(125.0, 40.0, 10);
const rotationAngle = Cesium.Math.toRadians(-90);

// 90도 회전된 프레임 생성
const rotationMatrix = Matrix3.fromRotationY(rotationAngle); // Y축을 중심으로 90도 회전
const fixedFrame = Transforms.northWestUpToFixedFrame(origin);
const rotatedFixedFrame = Matrix4.multiplyByMatrix3(fixedFrame, rotationMatrix, new Matrix4());

const cameraDest = Cartesian3.fromDegrees(125.0, 40.0, 1000);
const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);
function App() {

    const ref=useRef<CesiumComponentRef<CesiumViewer>>(null);
    const [flyGetPosition,setFlyGetPosition]=useState(flyToPoint);

    useEffect(() => {
        console.log('ref.current?.',ref.current)
        if(ref.current?.cesiumElement) {
            console.log('세슘 요소 있음.')
        }else{
            console.log('세슘 요소 없음.')
        }
    }, []);
    const getPosition=(e)=>{
        const scene =Cesium.Scene
        // 라디안 단위
        const clickedPosition=e.position
        console.log('clickedPosition?',clickedPosition)
        console.log('scene?',scene)

       //  const eventhandler=new Cesium.ScreenSpaceEventHandler(scene)
       // eventhandler.setInputAction(function(movement){
       //     console.log('movement????',movement)
       //  console.log('Cartographic',new Cesium.Cartographic)
       //     const cartographic = Cartographic.fromCartesian(clickedPosition.x,clickedPosition.y,100);
       //  console.log('cartographic?',cartographic)
       //     const longitude = Cesium.Math.toDegrees(cartographic.longitude);
       //     const latitude = Cesium.Math.toDegrees(cartographic.latitude);
       //     console.log('longitude?',longitude)
       //     console.log('latitude?',latitude)
       // },Cesium.ScreenSpaceEventType.LEFT_CLICK)

        // console.log('cesiumVeiwer point',CesiumViewer.prototype.entities)
        // setFlyGetPosition(Cartesian3.fromDegrees(x,y,2000))
    }
    const trackedEntity=(entity)=>{
        console.log('entity',entity)
    }
    return (
        <Viewer full ref={ref}>

            {/*<CameraLookAt {...lookAtPoint}/>*/}
            {/*<Camera />*/}
            {/*<CameraFlyTo destination={flyGetPosition}/>*/}
            {/*<Scene/>*/}
            <Entity name='Corridor' position={Cartesian3.fromDegrees(128.0, 40.0,100)} onClick={getPosition}>
                <CorridorGraphics
                    material={Color.BLUE}
                    positions={Cartesian3.fromDegreesArray([128.0, 40.0, 131.0, 40.0, 131.0, 35.0]) as any} // WORKAROUND
                    height={200000.0}
                    extrudedHeight={100000.0}
                    width={200000.0}
                    cornerType={CornerType.BEVELED}
                    outline // height or extrudedHeight must be set for outlines to display
                    outlineColor={Color.BLUE}
                />
            </Entity>
            <Entity name='pointer' position={Cartesian3.fromDegrees(127.0707383,35.7117244,100)} point={{ pixelSize: 10 ,color:Color.YELLOW}} onClick={getPosition}>
            </Entity>
            <Entity name='Cylinder' position={Cartesian3.fromDegrees(127.0707383, 50.7117244, 100)} onClick={getPosition}>
                <CylinderGraphics
                    length={400000.0}
                    topRadius={200000.0}
                    bottomRadius={200000.0}
                    material={Color.GREEN.withAlpha(0.5)}
                    outline
                    outlineColor={Color.DARKGREEN}
                />
            </Entity>
            <CameraFlyTo destination={cameraDest}/>
            <Model url={"Tile_+000_+002.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}
                   minimumPixelSize={128}
                   maximumScale={20000}
                   onClick={getPosition}
            >
            </Model>
            <Model url={"Tile_+000_+003.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}
                   minimumPixelSize={128}
                   maximumScale={20000}
                   onClick={getPosition}
            >
            </Model>
            <Model url={"Tile_+001_+001.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}
                   minimumPixelSize={128}
                   maximumScale={20000}
                   onClick={getPosition}
            >
            </Model>
            <Model url={"Tile_+001_+002.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}
                           minimumPixelSize={128}
                           maximumScale={20000}
                           onClick={getPosition}
            >
            </Model>

            {/*<PointPrimitiveCollection modelMatrix={Transforms.eastNorthUpToFixedFrame(center)}>*/}
            {/*    <PointPrimitive color={Color.ORANGE} position={new Cartesian3(58.0,58.0,0.0)}  onClick={(e)=>getPosition(e)}/>*/}
            {/*    <PointPrimitive color={Color.YELLOW} position={new Cartesian3(100000.0, -200000.0, 0.0)}/>*/}
            {/*</PointPrimitiveCollection>*/}
            {/*<CameraFlyTo destination={flyGetPosition} duration={2.0}/>*/}
        </Viewer>
    );
}

export default App;