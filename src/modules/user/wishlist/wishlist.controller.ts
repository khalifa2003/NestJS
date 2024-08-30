import { WishlistService } from './wishlist.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Role } from '../../../common/enums/role.enum';
import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AddToWishlistDto } from './Dto/add-to-wishlist.dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Manager, Role.User)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  async addProductToWishlist(
    @Req() req,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    const userId = req.user._id;
    const { productId } = addToWishlistDto;

    const user = await this.wishlistService.addProductToWishlist(
      userId,
      productId,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Product added successfully to your wishlist.',
      data: user.wishlist,
    };
  }

  @Delete(':productId')
  async removeProductFromWishlist(
    @Req() req,
    @Param('productId') productId: string,
  ) {
    const userId = req.user._id;

    const user = await this.wishlistService.removeProductFromWishlist(
      userId,
      productId,
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: 'success',
      message: 'Product removed successfully from your wishlist.',
      data: user.wishlist,
    };
  }

  @Get()
  async getUserWishlist(@Req() req) {
    const userId = req.user._id;
    const user = await this.wishlistService.getUserWishlist(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: 'success',
      results: user.wishlist.length,
      data: user.wishlist,
    };
  }
}
