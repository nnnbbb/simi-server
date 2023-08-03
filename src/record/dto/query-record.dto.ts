import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaginationRes } from "../../common/helper/pagination-res.helper";
import { WordResDto } from "../../word/dto/create-word.dto";

export class QueryRecordDto extends PaginationDto { }



export class QueryRecordResDto extends PaginationRes(WordResDto) {

}