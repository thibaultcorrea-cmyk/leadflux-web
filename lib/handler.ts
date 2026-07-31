import { NextResponse } from "next/server"


export const errorHandler = (error: Error, methodName?: string) => {

    console.error(`Something went wrong on ${methodName ?? "unknown method"}`, error)

}


export const errorApiHandler = (error: unknown) => {

    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })

}