import {YoutubeService} from "./youtube.service";
import {ConvertTimeDto} from "../../dto/ConvertTimeDto";
import {execFile} from "child_process";
import {ConvertRangeDto} from "../../dto/ConvertRangeDto";
import {TemporaryFileService} from "../TemporaryFileService";
import {Test, TestingModule} from "@nestjs/testing";
import {CommandBus, ICommand, ICommandBus} from "@nestjs/cqrs";
import {join} from "path";
import * as os from "os";
import * as fs from "fs";

describe('youtube service', () => {
    const testImg = join(os.tmpdir(), 'youtube-image-test');
    let youtubeService: YoutubeService;
    let temporaryFileService: TemporaryFileService;

    beforeEach(async () => {
        temporaryFileService = new class implements TemporaryFileService {
            createTemporaryFile(extension: string): string {
                return testImg + '.' + extension;
            }
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                YoutubeService,
                {provide: CommandBus, useFactory: () => new class implements ICommandBus {
                        execute<T extends ICommand>(command: T): Promise<any> {
                            return Promise.resolve(undefined);
                        }
                    }},
                {provide: 'TemporaryFileService', useValue: temporaryFileService}
            ]
        }).compile();
        youtubeService = module.get<YoutubeService>(YoutubeService);
        jest.setTimeout(30 * 1000);
    });

    it('ffmpeg check', () => {
        execFile('ffmpeg', ['-version'], (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                console.error(stdout);
                expect(error).toThrowError();
            }
            expect(stdout).not.toBeNull();
            expect(stdout).not.toBeUndefined();
            expect(stdout).not.toEqual('');
        });
    });

    it('youtube to image', async () => {
        const img = new ConvertTimeDto();
        img.v = 'dQw4w9WgXcQ';
        img.t = 18;

        const result = await youtubeService.image(img);
        console.log(result);
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
        expect(result).not.toEqual('');
        fs.stat(testImg + '.png', (err, stat) => {
            console.log(err, stat);
            expect(err).toBeNull();
            expect(stat).not.toBeUndefined();
            fs.unlink(testImg + '.png', (err) => {
                expect(err).toBeNull();
            });
        });
    });


    it('youtube to gif', async () => {
        const img = new ConvertRangeDto();
        img.v = 'dQw4w9WgXcQ';
        img.start = 18;
        img.time = 3;

        const result = await youtubeService.gif(img);
        console.log(result);
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
        expect(result).not.toEqual('');
        fs.stat(testImg + '.gif', (err, stat) => {
            console.log(err, stat);
            expect(err).toBeNull();
            expect(stat).not.toBeUndefined();
            fs.unlink(testImg + '.gif', (err) => {
                expect(err).toBeNull();
            });
        });
    });

    it('youtube to mp3', async () => {
        const img = new ConvertRangeDto();
        img.v = 'dQw4w9WgXcQ';
        img.start = 18;
        img.time = 3;

        const result = await youtubeService.mp3(img);
        console.log(result);
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
        expect(result).not.toEqual('');
        fs.stat(testImg + '.mp3', (err, stat) => {
            console.log(err, stat);
            expect(err).toBeNull();
            expect(stat).not.toBeUndefined();
            fs.unlink(testImg + '.mp3', (err) => {
                expect(err).toBeNull();
            });
        });
    });
});
