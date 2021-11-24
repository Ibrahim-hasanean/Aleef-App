import { Joi, celebrate, Segments, Modes, SchemaOptions } from "celebrate";


export const userItemListSchema = {
    [Segments.BODY]: Joi.object().keys({
        count: Joi.number().required(),
        itemId: Joi.string().required()
    })
}

export const updateUserItemListSchema = {
    [Segments.BODY]: Joi.object().keys({
        count: Joi.number().required(),
    })
}