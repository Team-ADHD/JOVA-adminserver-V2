import { Catch } from '@nestjs/common';
import {BaseExceptionFilter} from "../base-exception.filter";
import {AlreadyUserException} from "../../admin/exception/already-user.exception";

@Catch(AlreadyUserException)
export class AlreadyUserExceptionFilter extends BaseExceptionFilter<AlreadyUserException> {}